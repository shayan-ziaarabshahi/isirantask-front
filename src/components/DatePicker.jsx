import React from "react";
import styles from "./DatePicker.module.css";
import momentJalaali from "moment-jalaali";
import "jalaali-react-date-picker/lib/styles/index.css";
import { DatePicker } from "jalaali-react-date-picker";
import PN from "persian-number";


function CustomDatePicker({
  showDatePicker,
  setShowDatePicker,
  currentDate,
  setCurrentDate,
  setValue
}) {
  return (
    <div className={styles.datePickerContainer}>
      <div
        onClick={() => setShowDatePicker(!showDatePicker)}
        className={`${styles.datePickerField} ${
          showDatePicker ? styles.openDatePicker : styles.closedDatePicker
        }`}
      >
        {currentDate && (
          <div className={styles.datePickerShowContainer}>
            {PN.convertEnToPe(momentJalaali(currentDate).format("jYYYY/jM/jD"))}
          </div>
        )}
        <div className={styles.calenderIcon}>
          <i className="bi bi-calendar"></i>
        </div>
      </div>
      <div className={styles.datePickerWrapper}>
        {showDatePicker && (
          <DatePicker
            onChange={(data) => {
              if (data) {
                setCurrentDate(data._d);
                setValue("birthday", data?._d)
                setShowDatePicker(false);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

export default CustomDatePicker;
