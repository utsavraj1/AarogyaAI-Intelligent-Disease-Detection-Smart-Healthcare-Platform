import JoinPage from "@/pages/JoinPage";
import NotFoundPage from "@/pages/NotFoundPage";
import RoomPage from "@/pages/RoomPage";
import { Route, Routes } from "react-router-dom";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<JoinPage />} />
      <Route path="/room/:roomName" element={<RoomPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;