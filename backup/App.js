import { useEffect, useState } from "react";
import styles from "./App.module.css";
import { ImCross } from "react-icons/im";
import { AiFillDelete } from "react-icons/ai";
import { MdModeEditOutline } from "react-icons/md";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "./components/DatePicker";
import { toast } from "react-toastify";
import PN from "persian-number";
import momentJalaali from "moment-jalaali";



function App() {

  

  const [users, setUsers] = useState([]);

  /* get users */
  const getUsers = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_BACKEND_DOMAIN}/api/users`,
      });
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  /* add user form */
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
  const [showDatePicker1, setShowDatePicker1] = useState(false);
  const [currentDate1, setCurrentDate1] = useState();

  const formValidationSchema = yup.object().shape({
    username: yup.string().required("این کادر الزامی است."),
    firstName: yup.string().required("این کادر الزامی است."),
    lastName: yup.string().required("این کادر الزامی است."),
    birthday: yup.string().required("این کادر الزامی است."),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(formValidationSchema),
  });

  const submitFunc = async (data) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_BACKEND_DOMAIN}/api/user`,
        data,
      });
      toast("با موفقیت ثبت شد.");
      setUsers([...users, res.data.newUser]);
    } catch (err) {
      console.log(err);
    }
    setShowAddUserModal(false);
  };

  /* update user form */
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [currentDate2, setCurrentDate2] = useState();
  const [showDatePicker2, setShowDatePicker2] = useState(false);

  const formValidationSchema2 = yup.object().shape({
    username: yup.string().required("این کادر الزامی است."),
    firstName: yup.string().required("این کادر الزامی است."),
    lastName: yup.string().required("این کادر الزامی است."),
    birthday: yup.string().required("این کادر الزامی است."),
    userId: yup.string().required("این کادر الزامی است."),
  });

  const {
    handleSubmit: handleSubmit2,
    register: register2,
    formState: { errors: errors2 },
    setValue: setValue2,
  } = useForm({
    resolver: yupResolver(formValidationSchema2),
  });

  const handleUpdateUserButtonClick = (user) => {
    setShowUpdateUserModal(true);
    setValue2("userId", user._id);
    setValue2("username", user.username);
    setValue2("firstName", user.firstName);
    setValue2("lastName", user.lastName);
    setValue2("birthday", user.birthday);
    setCurrentDate2(user.birthday);
  };

  const submitFunc2 = async (data) => {
    //console.log(data)
    try {
      const res = await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_BACKEND_DOMAIN}/api/user`,
        data,
      });
      toast("با موفقیت اصلاح شد.");
      let updatedList = users.map((user) => {
        if (user._id === data.userId) {
          return res.data;
        } else {
          return user
        }
      });
      console.log(updatedList)
      setUsers(updatedList);
    } catch (err) {
      console.log(err);
    }
    setShowUpdateUserModal(false);
  };

  /* delete user */
  const handleDeleteUser = async (id) => {
    try {
      const res = await axios({
        method: "DELETE",
        url: `${process.env.REACT_APP_BACKEND_DOMAIN}/api/user?id=${id}`,
      });
      toast("با موفقیت حذف شد.");
      setUsers(users.filter((i) => i._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.addButton}
          onClick={() => setShowAddUserModal(true)}
        >
          +
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <td>نام کاربری</td>
              <td>نقش</td>
              <td>نام </td>
              <td>نام خانوادگی</td>
              <td>تاریخ تولد</td>
              <td>عملیات</td>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>
                  {PN.convertEnToPe(
                    momentJalaali(user.birthday).format("jYYYY/jM/jD")
                  )}
                </td>
                <td className={styles.operationsTD}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    <AiFillDelete />
                  </button>
                  <button
                    className={styles.editButton}
                    onClick={() => handleUpdateUserButtonClick(user)}
                  >
                    <MdModeEditOutline />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* add user modal */}
      {showAddUserModal ? (
        <>
          <div className={styles.backdrop}></div>
          <div className={styles.addDataBox}>
            <form onSubmit={handleSubmit(submitFunc)} noValidate>
              <div className={styles.addDataBoxHeader}>
                <span
                  className={styles.CloseButton}
                  onClick={() => setShowAddUserModal(false)}
                >
                  <ImCross />
                </span>
              </div>
              <div className={styles.addDataBoxBody}>
                <div className={styles.formFieldsContainer}>
                  <div className={styles.fieldContainer}>
                    <label>نام کاربری</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      {...register("username")}
                    />
                    {errors.username && (
                      <span className={styles.errorMessage}>
                        {errors.username.message}
                      </span>
                    )}
                  </div>
                  <div className={styles.fieldContainer}>
                    <label>نام</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <span className={styles.errorMessage}>
                        {errors.firstName.message}
                      </span>
                    )}
                  </div>
                  <div className={styles.fieldContainer}>
                    <label>نام خانوادگی</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <span className={styles.errorMessage}>
                        {errors.lastName.message}
                      </span>
                    )}
                  </div>
                  <div className={styles.fieldContainer}>
                    <label>تاریخ تولد</label>
                    <DatePicker
                      showDatePicker={showDatePicker1}
                      setShowDatePicker={setShowDatePicker1}
                      currentDate={currentDate1}
                      setCurrentDate={setCurrentDate1}
                      register={{ ...register("birthday") }}
                      setValue={setValue}
                    />
                    {errors.birthday && (
                      <span className={styles.errorMessage}>
                        {errors.birthday.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.addDataBoxFooter}>
                <button type="submit" className={styles.formSubmitButton}>
                  ذخیره
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        ""
      )}

      {/* update user modal */}
      {showUpdateUserModal ? (
        <>
          <div className={styles.backdrop}></div>
          <div className={styles.addDataBox}>
            <form onSubmit={handleSubmit2(submitFunc2)} noValidate>
              <div className={styles.addDataBoxHeader}>
                <span
                  className={styles.CloseButton}
                  onClick={() => setShowUpdateUserModal(false)}
                >
                  <ImCross />
                </span>
              </div>
              <div className={styles.addDataBoxBody}>
                <div className={styles.formFieldsContainer}>
                  <div className={styles.fieldContainer}>
                    <label>نام کاربری</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      {...register2("username")}
                    />
                    {errors2.username && (
                      <span className={styles.errorMessage}>
                        {errors2.username.message}
                      </span>
                    )}
                  </div>
                  <div className={styles.fieldContainer}>
                    <label>نام</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      {...register2("firstName")}
                    />
                    {errors2.firstName && (
                      <span className={styles.errorMessage}>
                        {errors2.firstName.message}
                      </span>
                    )}
                  </div>
                  <div className={styles.fieldContainer}>
                    <label>نام خانوادگی</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      {...register2("lastName")}
                    />
                    {errors2.lastName && (
                      <span className={styles.errorMessage}>
                        {errors2.lastName.message}
                      </span>
                    )}
                  </div>
                  <div className={styles.fieldContainer}>
                    <label>تاریخ تولد</label>
                    <DatePicker
                      showDatePicker={showDatePicker2}
                      setShowDatePicker={setShowDatePicker2}
                      currentDate={currentDate2}
                      setCurrentDate={setCurrentDate2}
                      register={{ ...register2("birthday") }}
                      setValue={setValue2}
                    />
                    {errors2.birthday && (
                      <span className={styles.errorMessage}>
                        {errors2.birthday.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.addDataBoxFooter}>
                <button type="submit" className={styles.formSubmitButton}>
                  اصلاح
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
