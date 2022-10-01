import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { DATE_FORMAT } from "../constants";
import "./index.css";

interface Props {
  onChange?: (e: Date) => void;
}

const Range: React.FC<Props> = ({ onChange }) => {
  const [time, setTime] = useState<Date>(new Date());
  const [range, setRange] = useState<number>(time.getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setRange((range) => range + 1000);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (onChange) {
      onChange(new Date(range));
    }
  }, [range, onChange]);

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value) {
      setRange(Number(e.target.value));
    }
  };

  const minDate = useMemo(() => {
    return new Date(time.getTime() - 86400000 / 2).getTime();
  }, [time]);

  const maxDate = useMemo(() => {
    return new Date(time.getTime() + 86400000 / 2).getTime();
  }, [time]);

  return (
    <>
      <div className="range-container">
        <div>
          <p>{moment(new Date(range)).format(DATE_FORMAT)}</p>
        </div>

        <div className="range-input-container">
          <p>{moment(new Date(minDate)).format(DATE_FORMAT)}</p>
          <input
            min={minDate}
            max={maxDate}
            onChange={handleOnChange}
            type="range"
          ></input>
          <p>{moment(new Date(maxDate)).format(DATE_FORMAT)}</p>
        </div>
      </div>
    </>
  );
};

export default Range;
