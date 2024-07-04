import { useState } from "react";
import { useAppDispatch, useAppSelector } from "./../../hooks";
import { counterActions } from "./counterSlice";

export default function Counter() {
  const dispatch = useAppDispatch();
  const { count } = useAppSelector((state) => state.counter);

  const [amount, setAmount] = useState(0);
  const amounted = amount;

  const resetAll = () => {
    setAmount(0);
    dispatch(counterActions.reset());
  };

  return (
    <section>
      <p>{count}</p>
      <div>
        <button onClick={() => resetAll()}>reset all</button>
      </div>
      <div>
        <button onClick={() => dispatch(counterActions.decrement())}>-</button>
        <button onClick={() => dispatch(counterActions.increment())}>+</button>
      </div>

      <div>
        <button
          onClick={() => dispatch(counterActions.decrementByAmount(amounted))}
        >
          decrement by {amount}
        </button>
        <button
          onClick={() => dispatch(counterActions.incrementByAmount(amounted))}
        >
          increment by {amount}
        </button>
      </div>

      <div>
        <label htmlFor="amount">
          choose an amount
          <input
            id="amount"
            name="amount"
            type="text"
            value={amounted}
            onChange={(e) => {
              setAmount(Number(e.target.value));
            }}
          />
        </label>
      </div>
    </section>
  );
}
