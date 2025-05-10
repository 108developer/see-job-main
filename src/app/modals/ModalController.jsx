import { useDispatch, useSelector } from "react-redux";
import LogoutModal from "./LogOutModal";
import ModalBase from "./ModalBase";
import { closeModal } from "@/redux/slices/modalSlice";
import CandidateAuth from "../(auth)/candidate/page";
import CandidateProfileModal from "./auth/CandidateProfileModal";
import CandidateRegisterModal from "./userProfile/CandidateRegisterModal";
import CandidateEducation from "./userProfile/CandidateEducationDetailsModal";
import CandidateJobPreferences from "./userProfile/CandidateJobPreferenceModal";
import RecruiterProfile from "./userProfile/EmployerProfileModal";
import AddQuestionsModal from "../(employer)/post-jobs/AddEditQuestionsModal";
import WorkExperienceModal from "./userProfile/WorkExperienceModal";
import CandidateEmailSender from "./post-jobs/SendMailsModal";

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
