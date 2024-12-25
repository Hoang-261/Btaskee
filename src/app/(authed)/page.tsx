import { Home } from "@/components/features/poster/home/Home";
import { getRole } from "@/libs/utils/authUtils";
import { Role } from "@/libs/utils/constants";
import { redirect } from "next/navigation";

const HomePage = async () => {
  const role = await getRole();

  if (role == Role["ADMIN"]) {
    redirect("/admin/users");
  }

  if (role == Role["JOB_SEEKER"]) {
    redirect("/seeker/posted-jobs");
  }

  return <Home />;
};

export default HomePage;
