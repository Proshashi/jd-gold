import { message } from "antd";

import { setSalesError, setSalesLoading } from "./salesSlice";
import firebase, {
  sales,
  items,
  customers,
  numbersCollection,
  cashbook,
} from "../../../app/firebase";
import { keywordsGenerator } from "../../../utils/keywordsGenerator";
import { getCapitalName } from "../../../utils/getCapitalName";
import { gramToTola, laalToTola } from "../../../utils/unitConversions";

export const addNewSale = ({ data, itemsUnit, resetForm }) => async (
  dispatch
) => {
  try {
    dispatch(setSalesLoading(true));
    const {
      finalSales,
      customerId,
      customerName,
      paid,
      remaining,
      grandTotal: total,
      billNumber,
    } = data;

    let unitConvertedFinalSales = [];
    // eslint-disable-next-line
    finalSales.map((sale) => {
      const toConvert = (value) => {
        if (itemsUnit === "tola") {
          return Number(laalToTola(value));
        } else {
          return Number(gramToTola(value));
        }
      };
      const { grossWeight, netWeight, wastage, weight } = sale;
      unitConvertedFinalSales.push({
        ...sale,
        grossWeight: toConvert(grossWeight),
        netWeight: toConvert(netWeight),
        wastage: toConvert(wastage),
        weight: toConvert(weight),
      });
    });

    let finalData = {
      customerId,
      customerName,
      finalSales: unitConvertedFinalSales,
      paid,
      remaining,
      total,
    };

    const customerExists = (await customers.doc(customerId).get()).exists;

    if (!customerExists) {
      const d = await customers.add({
        name: getCapitalName(customerName),
        dateAdded: firebase.firestore.Timestamp.fromDate(new Date()),
        address: "",
        phoneNumbers: [""],
        keywords: keywordsGenerator(customerName),
      });

      finalData = { ...finalData, customerId: d.id };
    }

    message.success("Item sold sucessfully", 2);
    const saleInfo = await sales.add({
      ...finalData,
      dateAdded: firebase.firestore.Timestamp.fromDate(new Date()),
      keywords: keywordsGenerator(finalData.customerName),
      billNumber,
      creditHistory: firebase.firestore.FieldValue.arrayUnion({
        paid: finalData.paid,
        date: firebase.firestore.Timestamp.fromDate(new Date()),
      }),
    });
    await numbersCollection.doc("bill").update({
      number: billNumber,
    });
    await customers.doc(finalData.customerId).update({
      sales: firebase.firestore.FieldValue.arrayUnion({
        ...finalData,
        saleId: saleInfo.id,
        date: firebase.firestore.Timestamp.fromDate(new Date()),
      }),
    });

    await numbersCollection.doc("bill").update({
      number: firebase.firestore.FieldValue.increment(1),
    });

    finalSales.forEach(async (sale) => {
      await items.doc(sale.itemId).update({
        quantity: firebase.firestore.FieldValue.increment(sale.quantity * -1),
        weight: firebase.firestore.FieldValue.increment(
          (sale.quantity * sale.weight + sale.wastage) * -1
        ),
      });
    });

    await cashbook.add({
      description: `Sale to ${customerName}`,
      date: firebase.firestore.Timestamp.fromDate(new Date()),
      category: "sales",
      type: "debit",
      amount: Number(paid),
    });

    console.log("Reaching");

    resetForm();

    dispatch(setSalesLoading(false));
  } catch (err) {
    console.log(err);
    dispatch(setSalesError(err.message));
  }
};
