import { completedMeetings } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export const recordCompletedMeeting = async (meetingDetails) => {
  try {
    await addDoc(collection(completedMeetings, "completedMeetings"), {
      title: meetingDetails.title,
      description: meetingDetails.description
    });
    console.log("Meeting recorded successfully!");
  } catch (error) {
    console.error("Error recording meeting:", error);
  }
};
