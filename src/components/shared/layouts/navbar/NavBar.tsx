"use client";

import classes from "./Navbar.module.css";
import { Transition } from "@mantine/core";
import { LinksGroup } from "../navbar-links-group/NavbarLinksGroup";
import { useMemo } from "react";

const posterSideBar = [
  {
    label: "Trang chủ",
    link: "/",
  },
  {
    label: "Công việc đã đăng",
    link: "/posted-jobs",
  },
  {
    label: "Ứng tuyển nhân viên",
    link: "/apply-seeker",
  },
  {
    label: "Phân tích chi tiêu",
    link: "/analysis",
  },
];

const adminSideBar = [
  {
    label: "Quản lý người dùng",
    link: "/admin/users",
  },
  {
    label: "Quản lý công việc",
    link: "/admin/posted-jobs",
  },
  {
    label: "Quản lý ứng tuyển nhân viên",
    link: "/admin/users-apply-seeker",
  },
  {
    label: "Phân tích chi tiêu",
    link: "/admin/analysis",
  },
];

const seekerSideBar = [
  {
    label: "Danh sách công việc",
    link: "/seeker/posted-jobs",
  },
  {
    label: "Danh sách công việc đã ứng tuyển",
    link: "/seeker/apply-jobs",
  },
  {
    label: "Phân tích chi tiêu",
    link: "/seeker/analysis",
  },
];
interface Props {
  toggle?: () => void;
  opened?: boolean;
  role: string;
}

export const Navbar = ({ opened, role }: Props) => {
  const links = useMemo(() => {
    const sideBar =
      role === "JOB_POSTER"
        ? posterSideBar
        : role === "ADMIN"
        ? adminSideBar
        : seekerSideBar;

    return sideBar.map((item) => <LinksGroup {...item} key={item.label} />);
  }, [role]);

  return (
    <>
      <nav className={classes.navbar__desktop}>
        <div className={classes.linksInner}>{links}</div>
      </nav>

      <Transition
        transition="pop-top-left"
        duration={200}
        mounted={!!opened}
        keepMounted={true}
      >
        {(styles) => (
          <nav style={styles}>
            {/* <nav className={classes.navbar} style={styles}> */}
            <div className={classes.linksInner}>{links}</div>
          </nav>
        )}
      </Transition>
    </>
  );
};
