import React from "react";
import "./App.css";

function App() {
  const [cardList, setCardList] = React.useState([
    { id: 1, order: 3, text: "Карточка 3" },
    { id: 2, order: 1, text: "Карточка 1" },
    { id: 3, order: 2, text: "Карточка 2" },
    { id: 4, order: 4, text: "Карточка 4" },
  ]);
  const [currentCard, setCurrentCard] = React.useState(null);
  const handleDragStart = (e, card) => {
    setCurrentCard(card);
  };

  const handleDragEnter = (e) => {
    console.log("enter");
    e.target.style.backgroundColor = "grey";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.target.style.backgroundColor = "white";
  };

  const handleDragEnd = (e) => {
    setCurrentCard(null);
  };

  const handleDrop = (e, card) => {
    e.preventDefault();
    e.target.style.backgroundColor = "white";
    setCardList(
      cardList.map((cardFromList) => {
        if (cardFromList.id === card.id) {
          return { ...cardFromList, order: currentCard.order };
        }
        if (cardFromList === currentCard) {
          return { ...cardFromList, order: card.order };
        }
        return cardFromList;
      })
    );
  };

  const sortCard = (a, b) => {
    return a.order - b.order;
  };

  return (
    <div className="app">
      {cardList.sort(sortCard).map((card) => (
        <div
          draggable={true}
          className={"card"}
          key={card.id}
          onDragStart={(e) => handleDragStart(e, card)}
          onDragEnter={handleDragEnter}
          onDragEnd={handleDragEnd}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, card)}
        >
          {card.text}
        </div>
      ))}
    </div>
  );
}

export default App;
