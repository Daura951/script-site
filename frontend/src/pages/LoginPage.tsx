import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import DiscordButton from "../components/DiscordButton";
import { Env } from "../Env";
import { LoginRequest } from "../types/LoginTypes";

export default function LoginPage() {
  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const formData = new URLSearchParams();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const response = await fetch(`${Env.BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (response.redirected) {
        window.location.href = response.url;
      }
    },
  });

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      loginMutation.mutateAsync(value);
    },
    validators: {
      onMount: LoginRequest,
      onChange: LoginRequest,
    },
  });

  return (
    <div className="pt-4 flex flex-column flex-1 items-center justify-center bg-[#0f172a] bg-[radial-gradient(circle_600px_at_50%_50%,rgba(59,130,246,0.3),transparent)]">
      <div className="mt-16 flex flex-col gap-5 border p-4 rounded border-slate-400/20 shadow-lg bg-white mb-5 md:mb-0">
        <header>
          <h1 className="text-4xl">Login</h1>
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
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value as LoginRequest["username"],
                    )
                  }
                />
                {field.state.meta.errors?.length > 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    {field.state.meta.errors[0]?.message}
                  </p>
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
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value as LoginRequest["password"],
                    )
                  }
                />
                {field.state.meta.errors?.length > 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          />
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                disabled={!canSubmit || isSubmitting}
                className="p-2 rounded-lg w-25 md:w-50 bg-white border border-slate-600/50 text-xl font-bold mt-5 hover:bg-slate-200 hover:cursor-pointer disabled:opacity-40 disabled:hover:bg-white disabled:hover:cursor-default"
              >
                Login
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
          <DiscordButton type="login" />
        </div>
      </div>
    </div>
  );
}
