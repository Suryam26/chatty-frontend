import { useFormik } from "formik";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";

export function Signup() {
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState<any>(null);
  const { signup } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      const { username, email, password } = values;
      const res = await signup(username, email, password);
      if (res.status === 400) {
        setError(res.data);
      } else {
        setSuccess("Congratulations! You have successfully registered.");
      }
      setSubmitting(false);
    },
  });

  return (
    <div>
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create a new account
          </h1>
          {success && (
            <>
              <div>{success}</div>
              <div>
                Click <Link to="/login">here</Link> to Login.
              </div>
            </>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="-space-y-px rounded-md">
            <input
              value={formik.values.username}
              onChange={formik.handleChange}
              type="text"
              name="username"
              placeholder="Username"
              className="border-gray-300 text-gray-900 placeholder-gray-300 focus:ring-gray-500 focus:border-gray-500 block w-full pr-10 focus:outline-none sm:text-sm rounded-md"
            />
            {error && error.username && <span>{error.username}</span>}
            <input
              value={formik.values.email}
              onChange={formik.handleChange}
              type="email"
              name="email"
              placeholder="Email"
              className="border-gray-300 text-gray-900 placeholder-gray-300 focus:ring-gray-500 focus:border-gray-500 block w-full pr-10 focus:outline-none sm:text-sm rounded-md"
            />
            {error && error.email && <span>{error.email}</span>}
            <input
              value={formik.values.password}
              onChange={formik.handleChange}
              type="password"
              name="password"
              className="border-gray-300 text-gray-900 placeholder-gray-300 focus:ring-gray-500 focus:border-gray-500 block w-full pr-10 focus:outline-none sm:text-sm rounded-md"
              placeholder="Password"
            />
            {error && error.password1 && <span>{error.password1}</span>}
          </div>

          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            {formik.isSubmitting ? "Signing up..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
}
