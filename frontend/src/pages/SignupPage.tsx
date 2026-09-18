import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import { Env } from "../Env";
import DiscordButton from "../components/DiscordButton";
import SuccessModal from "../components/SuccessModal";
import { apiFetch } from "../hooks/ApiClient";
import { SignupRequest, User } from "../types/LoginTypes";

export default function SignupPage() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const discordName = searchParams.get("username");
  const discordId = searchParams.get("id");
  const discordEmail = searchParams.get("email");

  const signupMutation = useMutation({
    mutationFn: async (data: SignupRequest) =>
      apiFetch(`${Env.API_BASE_URL}/users/signup`, {
        method: "POST",
        body: data,
        schema: User,
      }),
  });

  const form = useForm({
    defaultValues: {
      username: discordName ?? "",
      password: "",
      email: discordEmail ?? "",
      discordId: discordId ?? "",
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
    <div className="pt-4 flex-1 flex flex-col  items-center justify-center bg-[#0f172a] bg-[radial-gradient(circle_600px_at_50%_50%,rgba(59,130,246,0.3),transparent)]">
      <div className="mt-16 flex flex-col gap-5 border p-4 rounded border-slate-400/20 shadow-lg bg-white mb-5 md:mb-0">
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
                <label htmlFor="username">
                  Username<span className="text-red-600">*</span>
                </label>
                <input
                  id="username"
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
                    <li>{field.state.meta.errors[0]?.message}</li>
                  </ul>
                )}
              </div>
            )}
          />
          <form.Field
            name="email"
            children={(field) => (
              <div className="flex flex-col">
                <label htmlFor="email">
                  Email<span className="text-red-600">*</span>
                </label>
                <input
                  id="email"
                  className={`p-1.5 rounded border ${field.state.meta.errors.length ? "border-red-600 focus:ring-red-600/20" : "border-blue-600/20 focus:ring-blue-600/20"}  w-75 focus:outline-blue-600/20 focus:ring-2  focus:outline-none`}
                  placeholder="email"
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(e.target.value as SignupRequest["email"])
                  }
                />
                {field.state.meta.errors?.length > 0 && (
                  <ul className="mt-1 text-sm text-red-600">
                    <li>{field.state.meta.errors[0]?.message}</li>
                  </ul>
                )}
              </div>
            )}
          />
          <form.Field
            name="password"
            children={(field) => (
              <div className="flex flex-col">
                <label htmlFor="password">
                  Password<span className="text-red-600">*</span>
                </label>
                <input
                  id="password"
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
                    <li>{field.state.meta.errors[0]?.message}</li>
                  </ul>
                )}
              </div>
            )}
          />
          <form.Field
            name="discordId"
            children={() => (
              <input
                type="hidden"
                id="discordId"
                defaultValue={discordId ?? ""}
              />
            )}
          />
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                disabled={!canSubmit || isSubmitting}
                className="p-2 rounded-lg w-25 md:w-50 bg-white border border-slate-600/50 text-xl font-bold mt-5 hover:bg-slate-200 hover:cursor-pointer disabled:opacity-40 disabled:hover:bg-white disabled:hover:cursor-default"
              >
                Sign Up
              </button>
            )}
          />
        </form>

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="mt-5 flex w-full flex-row items-center gap-2">
            <hr className="grow" />
            <p>Or continue with</p>
            <hr className="grow" />
          </div>
          <DiscordButton type="signup" />
        </div>

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
