import { HomeCMS } from "@/src/libs/cms/types";
import { HomeVM } from "./types";

export function mapHome(data: HomeCMS["data"]): HomeVM {
  const dto = data.page;

  return {
    firstName: dto.firstName,
    lastName: dto.lastName,
    role: dto.role,
    picture: dto.picture,
  };
}
