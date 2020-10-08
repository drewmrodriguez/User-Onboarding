import React, {useState, useEffect} from "react";
import * as yup from "yup";
import axios from "axios";


export default function Form() {
const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    terms: false

})

const [buttonIsDisabled, setButtonIsDisabled] = useState(true);

const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    terms: ""
  });


const [users, setUsers] = useState([]);

const validateChange = (e) => {
    yup
      .reach(formSchema, e.target.name)
      .validate(
        e.target.type === "checkbox" ? e.target.checked : e.target.value
      )
      .then((valid) => {
        setErrors({ ...errors, [e.target.name]: "" });
      })
      .catch((err) => {
        console.log("err", err);
        setErrors({ ...errors, [e.target.name]: err.errors[0] });
      });
  };

const formSubmit = (e) => {
    e.preventDefault(); 
    console.log("working")
    axios
      .post("https://reqres.in/api/users", formState)
      .then((resp) => {
        setUsers(resp.data);
        setFormState({
            name: "",
            email: "",
            password: "",
            terms: false
        });
      })
      .catch((err) => console.log(err));
  };


  const inputChange = (e) => {
    e.persist(); 
    const newFormState = {
      ...formState,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value
    };

    validateChange(e); 
    setFormState(newFormState);
  };



const formSchema = yup.object().shape({
    name: yup.string().required("Name is required."),
    email: yup.string().email(),
    password: yup.string().min(6).required("Password must be 6 characters long"),
    terms: yup.boolean().oneOf([true])

})



useEffect(() =>{
    formSchema.isValid(formState).then((valid)=> {
        setButtonIsDisabled(!valid)
    })
}, [formState])


return (
    <form onSubmit={formSubmit}>
      <label htmlFor="name">
        Name
        <input
          id="name"
          type="text"
          name="name"
          value={formState.name}
          onChange={inputChange}
        />
      </label>
      <label htmlFor="email">
        Email
        <input
          id="email"
          type="text"
          name="email"
          value={formState.email}
          onChange={inputChange}
        />
      </label>
      <label htmlFor="password">
        Password
        <textarea
          id="password"
          type="text"
          name="password"
          value={formState.password}
          onChange={inputChange}
        />
      </label>
      <label htmlFor="terms" className="terms">
        <input
          type="checkbox"
          id="terms"
          name="terms"
          value={formState.terms}
          onChange={inputChange}
        />
        Terms & Conditions
      </label>
      <button type="submit" disabled={buttonIsDisabled}>
        Submit
      </button>
    </form>
  );




}