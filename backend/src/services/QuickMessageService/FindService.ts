import { Op } from "sequelize";
import QuickMessage from "../../models/QuickMessage";
import Company from "../../models/Company";
import User from "../../models/User";


type Params = {
  companyId: string;
  userId: string;
};

const FindService = async ({ companyId, userId }: Params): Promise<QuickMessage[]> => {

  const userProfile = (await User.findByPk(userId))?.profile;

  let notes: QuickMessage[]
  if(userProfile !== 'admin'){
    notes =  await QuickMessage.findAll({
     where: {
       companyId,
       geral: true,
     },
     include: [{ model: Company, as: "company", attributes: ["id", "name"] }],
     order: [["shortcode", "ASC"]]
   });
  }else{
    notes =  await QuickMessage.findAll({
      where: {
        companyId,
      },
      include: [{ model: Company, as: "company", attributes: ["id", "name"] }],
      order: [["shortcode", "ASC"]]
    });
  }

  return notes;
};

export default FindService;
