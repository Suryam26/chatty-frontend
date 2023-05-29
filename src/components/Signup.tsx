import { useFormik } from "formik";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";

export function Signup() {
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  const { signup } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      const { username, email, password } = values;
      const res = await signup(username, email, password);
      if (res.status === 400) {
        setError(res.data);
      } else {
        setSuccess(true);
        resetForm();
      }
      setSubmitting(false);
    },
  });

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create a new account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-5" onSubmit={formik.handleSubmit}>
            {success && (
              <p className="font-semibold text-center text-green-500">
                Account successfully created
              </p>
            )}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  type="text"
                  name="username"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {error && (
                <div className="mt-1 text-sm font-semibold text-red-600">
                  {error.username}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  type="email"
                  name="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {error && (
                <div className="mt-1 text-sm font-semibold text-red-600">
                  {error.email}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  type="password"
                  name="password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {error && (
                <div className="mt-1 text-sm font-semibold text-red-600">
                  {error.password1}
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {formik.isSubmitting ? "Signing up..." : "Signup"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already a member?{" "}
            <Link
              to="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign in to your account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
