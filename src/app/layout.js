"use client";

import { ApolloProvider } from "@apollo/client";
import { Footer } from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import ReduxWrapper from "@/redux/ReduxWrapper";
import "./globals.css";
import ModalController from "./modals/ModalController";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import client from "@/graphql/apolloClient";

export default function RootLayout({ children }) {
  return (
    <ApolloProvider client={client}>
      <ReduxWrapper>
        <html lang="en">
          <body>
            <Navbar />
            <ToastContainer />
            <ModalController />
            {children}
            <Footer />
          </body>
        </html>
      </ReduxWrapper>
    </ApolloProvider>
  );
}
