import { setWorkerError, setWorkerLoading } from "./workerSlice";
import firebase, {
  workers,
  items,
  cashbook,
  stocks,
  exports as itemsExport,
} from "../../../app/firebase";
import { v4 as uuidv4 } from "uuid";
import { keywordsGenerator } from "../../../utils/keywordsGenerator";
import { gramToTola, laalToTola } from "../../../utils/unitConversions";

export const addWorker = (workerData, resetForm) => async (dispatch) => {
  try {
    dispatch(setWorkerLoading(true));
    await workers.add({
      ...workerData,
      stockcredit: [],
      stockdebit: [],
      keywords: keywordsGenerator(workerData.name),
    });
    resetForm();
    dispatch(setWorkerLoading(false));
  } catch (err) {
    dispatch(setWorkerError(err.message));
  }
};

export const updateWorkerStock = (
  { id, remark, stockAmount, stockUnit, givenMaterial, type, name: workerName },
  resetForm,
  isRemaining
) => async (dispatch) => {
  try {
    const dataToSubmit = {
      type,
      remark,
      givenMaterial,
      total:
        stockUnit === "tola"
          ? laalToTola(stockAmount)
          : gramToTola(stockAmount),
    };

    const parsedUnit = stockUnit === "tola" ? "laal" : "gram";

    const stockId = uuidv4();

    dispatch(setWorkerLoading(true));

    await workers.doc(id).update({
      [`stock${type}`]: firebase.firestore.FieldValue.arrayUnion({
        ...dataToSubmit,
        total: Number(dataToSubmit.total),
        id: stockId,
        dateAdded: firebase.firestore.Timestamp.fromDate(new Date()),
        [type]: Number(dataToSubmit.total),
      }),
      stockData: {
        [givenMaterial.toLowerCase()]: firebase.firestore.FieldValue.increment(
          Number(dataToSubmit.total)
        ),
      },
      creditHistory: firebase.firestore.FieldValue.arrayUnion({
        ...dataToSubmit,
        total: Number(dataToSubmit.total),
        id: uuidv4(),
        dateAdded: firebase.firestore.Timestamp.fromDate(new Date()),
        credit: Number(dataToSubmit.total),
      }),
    });

    itemsExport.add({
      description: `Given ${stockAmount} ${parsedUnit} to ${workerName}`,
      date: firebase.firestore.Timestamp.fromDate(new Date()),
      worker: {
        id,
        workerName,
      },
      stockId,
      givenMaterial: givenMaterial.toLowerCase(),
      amount: dataToSubmit.total,
    });

    const stocksInfo = await stocks
      .where("name", "==", dataToSubmit.givenMaterial.trim().toLowerCase())
      .limit(1)
      .get();

    stocksInfo.forEach(async (doc) => {
      await stocks.doc(doc.id).update({
        stockQuantity: firebase.firestore.FieldValue.increment(
          dataToSubmit.total * -1
        ),
      });
    });

    if (isRemaining) {
      await workers.doc(id).update({
        [`remainingStock.${givenMaterial}`]: firebase.firestore.FieldValue.increment(
          -1 * Number(dataToSubmit.total)
        ),
      });
    }

    resetForm();
    dispatch(setWorkerLoading(false));
  } catch (err) {
    console.log(err);
    dispatch(setWorkerError(err.message));
  }
};

export const updateStockFromState = (data, resetForm) => async (disptach) => {
  try {
    const {
      creditId,
      finalWeight,
      quantity,
      givenMaterial,
      item,
      weightRemaining,
      remark,
      totalWeight,
      workerId,
    } = data;

    disptach(setWorkerLoading(true));
    const workerData = (await workers.doc(data.workerId).get()).data();

    const remainingParsed = weightRemaining > 0 ? weightRemaining : 0;

    const givenMaterialParsed = givenMaterial.trim().toLowerCase();

    const paymentId = uuidv4();

    await workers.doc(workerId).update({
      stockdebit: firebase.firestore.FieldValue.arrayUnion({
        dateAdded: firebase.firestore.Timestamp.fromDate(new Date()),
        debit: finalWeight,
        givenMaterial,
        id: uuidv4(),
        remark,
        weightRemaining,
        totalWeight,
      }),
      stockcredit: workerData.stockcredit.filter((s) => s.id !== creditId),
      [`remainingStock.${givenMaterialParsed}`]: firebase.firestore.FieldValue.increment(
        remainingParsed
      ),

      paymentHistory: firebase.firestore.FieldValue.arrayUnion({
        dateAdded: firebase.firestore.Timestamp.fromDate(new Date()),
        payment: data.item.workerWage * quantity,
        subject: `Wage for ${data.item.name} ${quantity}`,
        type: "debit",
        id: paymentId,
      }),
    });

    await items.doc(item.id).update({
      quantity: firebase.firestore.FieldValue.increment(Number(quantity)),
      weight: firebase.firestore.FieldValue.increment(Number(finalWeight)),
    });

    await cashbook.add({
      description: `Wage for ${data.quantity} ${item.name} to ${workerData.name}`,
      date: firebase.firestore.Timestamp.fromDate(new Date()),
      category: "wages",
      type: "debit",
      amount: Number(item.workerWage) * quantity,
      paymentId,
    });

    resetForm();

    disptach(setWorkerLoading(false));
  } catch (err) {
    console.log(err);
    disptach(setWorkerError(err.message));
  }
};

export const addWorkerWage = (workerId, workerData, resetForm) => async (
  dispatch
) => {
  try {
    dispatch(setWorkerLoading(true));
    const uniqueId = uuidv4();
    await workers.doc(workerId).update({
      paymentHistory: firebase.firestore.FieldValue.arrayUnion({
        ...workerData,
        dateAdded: firebase.firestore.Timestamp.fromDate(new Date()),
        id: uniqueId,
      }),
    });

    await cashbook.add({
      description: workerData.subject,
      date: firebase.firestore.Timestamp.fromDate(new Date()),
      category: "wages",
      type: workerData.type,
      amount: Number(workerData.payment),
      paymentId: uniqueId,
    });
    resetForm();
    dispatch(setWorkerLoading(false));
  } catch (err) {
    dispatch(setWorkerError(err.message));
  }
};
