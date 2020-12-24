import React from "react";
import HeaderTextComponent from "../../includes/Texts/HeaderTextComponent";
import useFetchFromDb from "../../../hooks/useFetchFromDB";
import { stocks } from "../../../app/firebase";
import GlowLoader from "../../includes/Loaders/GlowLoader";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { tolaToGram, tolaToLaal } from "../../../utils/unitConversions";
import { Link } from "react-router-dom";

const StockCard = ({
  name,
  amount,
  image,
  gradient,
  shadowColor,
  itemsUnit,
}) => {
  const convertedTotal =
    itemsUnit === "tola" ? tolaToLaal(amount) : tolaToGram(amount);

  const convertedUnit = itemsUnit === "tola" ? "laal" : "gram";

  return (
    <Link to={`/goldstock/${name.toLowerCase()}`} style={{ color: "inherit" }}>
      <div
        className="__jd_main-goldStock--list__item"
        style={{
          backgroundImage: gradient,
          boxShadow: `1px 1px 10px ${shadowColor}`,
        }}
      >
        <div className="__jd_main-goldStock--list__item_detail">
          <div className="__jd_main-goldStock--list__item_detail-name">
            {name}
          </div>
          <div
            className="__jd_main-goldStock--list__item_detail-amount"
            title={`${convertedTotal} (${convertedUnit})`}
          >
            {Number(convertedTotal).toFixed(4)} {convertedUnit}
          </div>
        </div>
        <div className="__jd_main-goldStock--list__item_icon">
          <img src={image} alt={name} />
        </div>
      </div>
    </Link>
  );
};

function getItemWithQuantity(data) {
  let obj = {};
  data.forEach((doc) => {
    const name = doc.name.toLowerCase();
    obj = {
      ...obj,
      [name]: doc.stockQuantity,
    };
  });
  return obj;
}

const GoldStock = () => {
  const [stocksData, setStocksData] = useState();

  // eslint-disable-next-line
  const [data, loading, error] = useFetchFromDb(stocks);

  const { itemsUnit } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (data) {
      setStocksData(getItemWithQuantity(data));
    }
  }, [data]);

  const goldGradient =
    "linear-gradient( 90deg, #f2cd6c 0%,  #f2cd6c 1.7%, #f2cd6c 41.7%, #e2b754 77.6%, #e2b754 100%  )";

  const silverGradient =
    "-webkit-linear-gradient(top, #C0C0C0 0%, #B1B1B1 100%)";

  const diamondGradient =
    "-webkit-linear-gradient(left, #C0C0C0 0%, #5E7DAB 100%)";

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GlowLoader />
      </div>
    );
  }

  return (
    <div className="__jd_main-goldStock">
      <HeaderTextComponent>Items stocks</HeaderTextComponent>
      <div className="__jd_main-goldStock--list">
        <StockCard
          name="Gold"
          amount={stocksData && stocksData.gold}
          image="./images/icons/gold.svg"
          gradient={goldGradient}
          shadowColor="#f2cd6c"
          itemsUnit={itemsUnit}
        />
        <StockCard
          name="Silver"
          amount={stocksData && stocksData.silver}
          image="./images/icons/silver.svg"
          gradient={silverGradient}
          shadowColor="#B1B1B1"
          itemsUnit={itemsUnit}
        />
        <StockCard
          name="Diamond"
          amount={stocksData && stocksData.diamond}
          image="./images/icons/diamond.png"
          gradient={diamondGradient}
          shadowColor="#5E7DAB"
          itemsUnit={itemsUnit}
        />
      </div>
    </div>
  );
};

export default GoldStock;
