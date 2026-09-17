import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Env } from "../Env";
import SuccessModal from "../components/SuccessModal";
import { SignupRequest } from "../types/LoginTypes";

export default function SignupPage() {
  const nav = useNavigate();

  const signupMutation = useMutation({
    mutationFn: async (data: SignupRequest) => {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);

      const response = await fetch(`${Env.API_BASE_URL}/users/signup`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error creating user");
      }
    },
  });

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },

    onSubmit: async ({ value }) => {
      await signupMutation.mutateAsync(value);
    },
    validators: {
      onMount: SignupRequest,
      onChange: SignupRequest,
    },
  });

  return (
    <div className="pt-4 flex-1 flex flex-col text-white items-center justify-center bg-[#0f172a] bg-[radial-gradient(circle_600px_at_50%_50%,rgba(59,130,246,0.3),transparent)]">
      <div className="mt-16 text-black border p-4 rounded border-slate-400/20 shadow-lg bg-white">
        <header>
          <h1 className="text-4xl">Sign up!</h1>
        </header>
        <form
          className="mt-5 flex flex-col gap-2 items-center justify-center"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="username"
            children={(field) => (
              <div className="flex flex-col">
                <input
                  type="text"
                  className={`p-1.5 rounded border ${field.state.meta.errors.length ? "border-red-600 focus:ring-red-600/20" : "border-blue-600/20 focus:ring-blue-600/20"}  w-75 focus:outline-blue-600/20 focus:ring-2  focus:outline-none`}
                  placeholder="username"
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value as SignupRequest["username"],
                    )
                  }
                />
                {field.state.meta.errors?.length > 0 && (
                  <ul className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors.map((err, i) => (
                      <li key={i}>{err?.message}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          />
          <form.Field
            name="email"
            children={(field) => (
              <div className="flex flex-col">
                <input
                  type="email"
                  className={`p-1.5 rounded border ${field.state.meta.errors.length ? "border-red-600 focus:ring-red-600/20" : "border-blue-600/20 focus:ring-blue-600/20"}  w-75 focus:outline-blue-600/20 focus:ring-2  focus:outline-none`}
                  placeholder="email"
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(e.target.value as SignupRequest["email"])
                  }
                />
                {field.state.meta.errors?.length > 0 && (
                  <ul className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors.map((err, i) => (
                      <li key={i}>{err?.message}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          />
          <form.Field
            name="password"
            children={(field) => (
              <div className="flex flex-col">
                <input
                  type="password"
                  className={`p-1.5 rounded border ${field.state.meta.errors.length ? "border-red-600 focus:ring-red-600/20" : "border-blue-600/20 focus:ring-blue-600/20"}  w-75 focus:outline-blue-600/20 focus:ring-2  focus:outline-none`}
                  placeholder="password"
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value as SignupRequest["password"],
                    )
                  }
                />
                {field.state.meta.errors?.length > 0 && (
                  <ul className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors.map((err, i) => (
                      <li key={i}>{err?.message}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          />
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                disabled={!canSubmit || isSubmitting}
                className="p-2 rounded-lg w-25 md:w-50 bg-white border border-slate-600/50 text-xl font-bold mt-5 hover:bg-slate-200 hover:cursor-pointer disabled:bg-slate-600"
              >
                Sign Up
              </button>
            )}
          />
        </form>
        {(signupMutation.isSuccess || signupMutation.isError) && (
          <SuccessModal
            isSuccess={signupMutation.isSuccess}
            message={
              signupMutation.isSuccess
                ? "Account created successfully!"
                : (signupMutation.error?.message ?? "Signup failed")
            }
            okFn={() => nav("/login")}
          />
        )}
      </div>
    </div>
  );
}
