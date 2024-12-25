import { Layout } from "@/components/shared/layouts/Layout";
import { getRole } from "@/libs/utils/authUtils";
import { Role } from "@/libs/utils/constants";

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutAdmin = async ({ children }: LayoutProps) => {
  const role = await getRole();

  if (role !== Role["ADMIN"]) {
    return <div>Không có quyền truy cập, trang này chỉ dành cho ADMIN</div>;
  }

  return <>{children}</>;
};

export default LayoutAdmin;
