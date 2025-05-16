import { closeModal } from "@/redux/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import CandidateAuth from "../(auth)/candidate/page";
import AddQuestionsModal from "../(employer)/post-jobs/AddEditQuestionsModal";
import CandidateProfileModal from "./auth/CandidateProfileModal";
import LogoutModal from "./LogOutModal";
import ModalBase from "./ModalBase";
import CandidateEmailSender from "./post-jobs/SendMailsModal";
import CandidateEducation from "./userProfile/CandidateEducationDetailsModal";
import CandidateJobPreferences from "./userProfile/CandidateJobPreferenceModal";
import CandidateRegisterModal from "./userProfile/CandidateRegisterModal";
import RecruiterProfile from "./userProfile/EmployerProfileModal";
import ForgotPasswordModal from "./userProfile/ForgotPasswordModal";
import OtpVerification from "./userProfile/OtpVerification";
import ResetPassword from "./userProfile/ResetPassword";
import WorkExperienceModal from "./userProfile/WorkExperienceModal";

const ModalController = () => {
  const { modalType, modalProps } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const closeModalHandler = () => {
    dispatch(closeModal());
  };

  const renderModal = () => {
    return modalType === "logout" ? (
      <LogoutModal closeModal={closeModalHandler} {...modalProps} />
    ) : modalType === "candidateAuth" ? (
      <CandidateAuth closeModal={closeModalHandler} {...modalProps} />
    ) : modalType === "candidateProfile" ? (
      <CandidateProfileModal closeModal={closeModalHandler} {...modalProps} />
    ) : modalType === "candidateRegisterModal" ? (
      <CandidateRegisterModal closeModal={closeModalHandler} {...modalProps} />
    ) : modalType === "educationDetailsModal" ? (
      <CandidateEducation closeModal={closeModalHandler} {...modalProps} />
    ) : modalType === "jobPreferenceModal" ? (
      <CandidateJobPreferences closeModal={closeModalHandler} {...modalProps} />
    ) : modalType === "workExperienceModal" ? (
      <WorkExperienceModal closeModal={closeModalHandler} {...modalProps} />
    ) : modalType === "recruiterProfileModal" ? (
      <RecruiterProfile closeModal={closeModalHandler} {...modalProps} />
    ) : modalType === "addQuestionsModal" ? (
      <AddQuestionsModal closeModal={closeModalHandler} {...modalProps} />
    ) : modalType === "sendMailsModal" ? (
      <CandidateEmailSender closeModal={closeModalHandler} {...modalProps} />
    ) : modalType === "forgotPasswordModal" ? (
      <ForgotPasswordModal closeModal={closeModalHandler} {...modalProps} />
    ) : modalType === "otpVerificationModal" ? (
      <OtpVerification closeModal={closeModalHandler} {...modalProps} />
    ) : modalType === "resetPasswordModal" ? (
      <ResetPassword closeModal={closeModalHandler} {...modalProps} />
    ) : null;
  };

  return (
    modalType && (
      <ModalBase isOpen={true} onClose={closeModalHandler}>
        {renderModal()}
      </ModalBase>
    )
  );
};

export default ModalController;
