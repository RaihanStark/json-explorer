import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const validatePassword = async (formData) => {
  "use server";

  const cookieStore = cookies();

  cookieStore.set("password", formData.get("password"), {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    httpOnly: true,
  });

  redirect("/");
};

export default function PasswordPage() {
  return (
    <div className="p-5 flex items-center justify-center h-[100vh]">
      <Card>
        <CardBody className="gap-4 p-5">
          <h1 className="text-xl text-center">
            Enter your password to unlock the app
          </h1>

          <form action={validatePassword} className="flex flex-col gap-4">
            <Input type="text" name="password" />
            <Button color="warning" type="submit">
              Unlock
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
