import { setImportError, setImportLoading } from "./ImportsSlice";
import firebase, { cashbook, imports, stocks } from "../../../app/firebase";
import { keywordsGenerator } from "../../../utils/keywordsGenerator";
import { gramToTola, laalToTola } from "../../../utils/unitConversions";
import { getCapitalName } from "../../../utils/getCapitalName";

export const addImport = (data, itemsUnit, resetForm) => async (dispatch) => {
  try {
    setImportLoading(true);
    const importData = {
      customerName: getCapitalName(data.customer),
      itemName: data.item.name,
      pricePerUnit: Number(data.pricePerUnit),
      quantity:
        itemsUnit === "tola"
          ? Number(laalToTola(data.quantity))
          : Number(gramToTola(data.quantity)),
      total: Number(data.pricePerUnit) * Number(data.quantity),
      paid: Number(data.paid),
      remaining:
        Number(data.pricePerUnit) * Number(data.quantity) - Number(data.paid),
    };

    await imports.add({
      ...importData,
      dateAdded: firebase.firestore.Timestamp.fromDate(new Date()),
      keywords: keywordsGenerator(importData.customerName),
      creditHistory: firebase.firestore.FieldValue.arrayUnion({
        paid: importData.paid,
        date: firebase.firestore.Timestamp.fromDate(new Date()),
      }),
    });

    const stocksInfo = await stocks
      .where("name", "==", importData.itemName.trim().toLowerCase())
      .limit(1)
      .get();

    if (stocksInfo.empty) {
      return await stocks.add({
        name: importData.itemName,
        stockQuantity: importData.quantity,
        stockPricePerUnit: importData.pricePerUnit,
        dateAdded: firebase.firestore.Timestamp.fromDate(new Date()),
      });
    }

    stocksInfo.forEach(async (doc) => {
      await stocks.doc(doc.id).update({
        stockQuantity: firebase.firestore.FieldValue.increment(
          importData.quantity
        ),
      });
    });

    cashbook.add({
      description: `Import ${importData.itemName} from ${importData.customerName}`,
      date: firebase.firestore.Timestamp.fromDate(new Date()),
      category: "expenditure",
      type: "credit",
      amount: Number(data.paid),
    });

    resetForm();

    setImportLoading(false);
  } catch (err) {
    console.log(err);
    setImportError(err.message);
  }
};
