import { SerializeUser } from "../../helpers/SerializeUser";
import ShowUserService from "./ShowUserService";

interface UserData {
  status?: string;
}

interface Request {
  userData: UserData;
  userId: string | number;
}

interface Response {
  id: number;
  name: string;
  email: string;
  profile: string;
  status: string;
}

const UpdateUserStatusService = async ({
  userData,
  userId
}: Request): Promise<Response | undefined> => {
  const user = await ShowUserService(userId);

  const { status } = userData;

  await user.update({
    status
  });
  await user.reload();

  return SerializeUser(user);
};

export default UpdateUserStatusService;
