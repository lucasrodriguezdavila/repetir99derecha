import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import "./index.css";
import { useSatellite } from "../../context/SatelliteContext";
import { Live } from "../Live";

interface Props {
  onChange?: (e: Date) => void;
  isHidden?: boolean;
}

const Range: React.FC<Props> = ({ onChange, isHidden }) => {
  const [time, setTime] = useState<Date>(new Date());
  const { relativeTime, setRelativeTime } = useSatellite();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setRelativeTime(
        (relativeTime) => new Date(relativeTime.getTime() + 1000)
      );
    }, 1000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (onChange) {
      onChange(new Date(relativeTime));
    }
  }, [relativeTime, onChange]);

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value) {
      setRelativeTime(new Date(Number(e.target.value)));
    }
  };

  const minDate = useMemo(() => {
    return new Date(time.getTime() - 86400000 / 2).getTime();
  }, [time]);

  const maxDate = useMemo(() => {
    return new Date(time.getTime() + 86400000 / 2).getTime();
  }, [time]);

  const hidden = isHidden ? "hidden" : "";

  return (
    <>
      <div className={`range-wrapper ${hidden}`}>
        <div className="range-container">
          <div className="range-dates-container">
            <p>{moment(new Date(relativeTime)).format("DD/MM/YYYY")}</p>
            <p>{moment(new Date(relativeTime)).format("HH:mm:ss")}</p>
          </div>

          <div className="range-input-container">
            <input
              min={minDate}
              max={maxDate}
              value={relativeTime.getTime()}
              onChange={handleOnChange}
              type="range"
            ></input>
          </div>
        </div>
        <Live />
      </div>
    </>
  );
};

export default Range;
