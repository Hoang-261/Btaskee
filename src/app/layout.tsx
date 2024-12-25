import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "dayjs/locale/vi";
import "mantine-react-table/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import Provider from "@/providers/provider";
import SessionProvider from "@/providers/sessionProvider";
import QueryClientProvider from "@/providers/queryClientProvider";
import { Notifications } from "@mantine/notifications";
import ModalsProvider from "@/providers/modalProvider";
import PayPalProvider from "@/providers/paypalProvider";
import { MaintenanceContextProvider } from "@/components/features/maintenance/MaintenanceContext";

export const metadata = {
  title: "Btaskee",
  description: "Btaskee",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <SessionProvider>
          <QueryClientProvider>
            <Provider>
              <PayPalProvider>
                <MantineProvider>
                  <ModalsProvider>
                    <MaintenanceContextProvider>
                      <Notifications position="top-right" />
                      {children}
                    </MaintenanceContextProvider>
                  </ModalsProvider>
                </MantineProvider>
              </PayPalProvider>
            </Provider>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
