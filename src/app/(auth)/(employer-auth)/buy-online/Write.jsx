"use client";

import SEOModal from "@/app/modals/SEOModal";
import { Loader } from "@/components/ui/loader";
import { useGetPageDataQuery } from "@/redux/api/admin";
import { setModal } from "@/redux/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";

const Write = () => {
  const { useremail } = useSelector((state) => state.auth);
  const { data, isLoading } = useGetPageDataQuery("buy-online");

  const dispatch = useDispatch();

  const openBuyOnlineModal = () => {
    dispatch(
      setModal({
        modalType: "ModalForm",
        modalProps: { data, type: "buy-online" },
      })
    );
  };

  return (
    <div className="flex flex-col w-full p-2 md:p-4 lg:p-8 xl:px-28 py-8 space-y-6 min-h-screen">
      <div className="flex justify-between items-center">
        <SEOModal slug="buy-online" />
        <h1 className="text-2xl font-bold w-full items-center justify-center flex">
          Buy Online
        </h1>
        {useremail === "admin@example.com" && (
          <button
            onClick={openBuyOnlineModal}
            className="py-1 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-screen w-full gap-8 p-4">
          <Loader count={5} height={50} />
        </div>
      ) : (
        <div
          dangerouslySetInnerHTML={{
            __html: data?.description || "Content Not Available",
          }}
        />
      )}
    </div>
  );
};

export default Write;
