import { HomeCMS } from "@/src/libs/cms/types";
import { HomeVM } from "./pages/HomePage";

export function mapHome(dto: HomeCMS): HomeVM {
  return {
    firstName: dto.firstName,
    lastName: dto.lastName,
    role: dto.role,
    picture: dto.picture,
  };
}
