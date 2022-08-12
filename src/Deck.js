import React, { useState, useRef } from "react";
import axios from "axios";
import { useEffect } from "react";
import "./Deck.css";
import Card from "./Card";

const Deck = () => {
  const [deckId, setDeckId] = useState("");
  const [cardArray, setCardArray] = useState([]);
  const [autoDraw, setAutoDraw] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    async function getDeckId() {
      const res = await axios.get(
        "http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );
      setDeckId(res.data.deck_id);
      console.log(deckId);
    }
    getDeckId();
  }, []);

  useEffect(() => {
    async function getCard() {
      const res = await axios.get(
        `http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
      );

      if (res.data.remaining === 0) {
        setTimeout(() => {
          alert("no more cards!");
        }, 300);

        setAutoDraw(false);
      }

      setCardArray((cardArray) => [...cardArray, res.data.cards[0].image]);
    }

    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await getCard();
      }, 200);
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoDraw, setAutoDraw]);

  const toggleAutoDraw = () => {
    if (autoDraw) {
      setAutoDraw(false);
    } else {
      setAutoDraw(true);
    }
  };

  return (
    <div className="Deck">
      {deckId ? (
        <button className="Deck-gimme" onClick={toggleAutoDraw}>
          {autoDraw ? "STOP" : "KEEP"} DRAWING FOR ME!
        </button>
      ) : null}
      <div className="Deck-cardarea">
        {cardArray.map((card) => (
          <Card imgUrl={card} />
        ))}
      </div>
    </div>
  );
};

export default Deck;
