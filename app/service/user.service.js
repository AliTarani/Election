const ServiceResult = require('../models/api/ServiceResult');
const ResponseMessage = require('../models/api/ResponseMessage');
const ResponseMessageType = require('../models/api/ResponseMessageType');
const User = require('../models/database/user');
const Condidate = require('../models/database/condidate');
const { forEach } = require('lodash');

class UserService {
  async createUserService(userData) {
    const { name, melliCode, password } = userData;
    const result = await User.findOne({ melliCode });
    if (!result) {
      let user = new User({
        name: name,
        password: password,
        melliCode: melliCode
      });

      await user.hashPassword(password);
      user = await user.save();

      return new ServiceResult({
        success: true,
        result: user,
        message: [
          new ResponseMessage({
            eventId: 200,
            type: ResponseMessageType.info,
            message: `ثبت نام شما با موفقیت انجام شد ${userData.name}`,
            alertUser: true
          })
        ],
        httpMethodCode: 200
      });
    } else {
      const data = new ServiceResult({
        success: false,
        httpMethodCode: 401,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 401,
            type: ResponseMessageType.error,
            message: 'ایمیل یا کدملی در سیستم موجود است',
            alertUser: true
          })
        ]
      });

      return data;
    }

  }

  async getAllUsersService() {
    const users = await User.find().populate(
      {
        path: 'elections',
        populate: {
          model: "Elections",
          path: 'election'
        }
      }
    )
      .select("-password");
    if (users.length === 0) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 404,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 404,
            type: ResponseMessageType.error,
            message: 'کاربری یافت نشد',
            alertUser: true
          })
        ]
      });
    }

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: users,
      message: [
        new ResponseMessage({
          eventId: 200,
          type: ResponseMessageType.success,
          message: 'success get',
          alertUser: false
        })
      ]
    });
  }

  async searchUsersService(name) {
    const users = await User.find({ name: new RegExp(name, "i") }).populate(
      {
        path: 'Elections',
        populate: {
          path: 'elections electionId'
        }
      }
    )
      .select("-password");
    if (users.length === 0) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 404,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 404,
            type: ResponseMessageType.error,
            message: 'کاربری یافت نشد',
            alertUser: true
          })
        ]
      });
    }

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: users,
      message: [
        new ResponseMessage({
          eventId: 200,
          type: ResponseMessageType.success,
          message: 'success get',
          alertUser: false
        })
      ]
    });
  }

  async getUserByIdService(id) {
    // const user = await User.findById(id).select("-password");

    const user = await User.findById(id).populate(
      {
        path: 'elections',
        populate: {
          model: "Elections",
          path: 'election',
          populate: {
            model: "Condidates",
            path: 'condidates',
            select: 'user',
            populate: {
              path: 'user',
              model: 'Users',
              select: 'name'
            }
          }
        }
      }
    )
      // .populate(
      //   {
      //     path: 'elections',
      //     populate: {
      //       model: 'Condidates',
      //       path: 'votes',
      //       select: 'user',
      //       populate: {
      //         path: 'user',
      //         model: 'Users',
      //         select: 'name'
      //       }

      //     }
      //   }
      // )
      .select("-password");

    if (!user) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 404,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 404,
            type: ResponseMessageType.error,
            message: 'کاربر یافت نشد',
            alertUser: true
          })
        ]
      });
    }

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: user,
      message: [
        new ResponseMessage({
          eventId: 200,
          type: ResponseMessageType.success,
          message: 'success get',
          alertUser: false
        })
      ]
    });
  }

  async updateUserByIdService(id, model) {
    let user = await User.findById(id).select("-password");

    if (!user) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 404,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 404,
            type: ResponseMessageType.error,
            message: 'کاربر یافت نشد',
            alertUser: true
          })
        ]
      });
    }

    user = Object.assign(user, model)
    // user = { ...user, ...model }

    if (!!model.password) {
      await user.hashPassword(model.password);
    }



    const result = await user.save();

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: result,
      message: [
        new ResponseMessage({
          eventId: 200,
          type: ResponseMessageType.success,
          message: 'اطلاعات کاربر بروزرسانی شد',
          alertUser: true
        })
      ]
    });
  }

  async deleteUserByIdService(id) {
    const result = await User.findById(id);

    if (!result) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 404,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 404,
            type: ResponseMessageType.error,
            message: 'کاربر یافت نشد',
            alertUser: true
          })
        ]
      });
    }

    const user = await User.findByIdAndRemove(id);

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: user,
      message: [
        new ResponseMessage({
          eventId: 200,
          type: ResponseMessageType.success,
          message: 'کاربر حذف گردید',
          alertUser: true
        })
      ]
    });
  }

  async getUserElectionsService(id) {

    const user = await User.findById(id)
      .populate(
        {
          path: 'elections',
          populate: {
            path: 'election',
            model: 'Elections',
            select: 'title cover'
          }
        }
      )
      .select("elections");
    // .populate(
    //   {
    //     path: 'elections',
    //     populate: {
    //       path: 'votes',
    //       model: 'Condidates',
    //       select: 'name'

    //     }
    //   }
    // );

    if (!user) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 404,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 404,
            type: ResponseMessageType.error,
            message: 'کاربر یافت نشد',
            alertUser: true
          })
        ]
      });
    }

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: user.elections,
      message: [
        new ResponseMessage({
          eventId: 200,
          type: ResponseMessageType.success,
          message: 'success get',
          alertUser: false
        })
      ]
    });
  }

  async getUserVoteService(userId, electionId) {

    const user = await User.findById(userId)
      .select("elections")
      .find({
        "elections.election": electionId
      })
      .populate(
        {
          path: 'elections',
          populate: {
            path: 'election',
            model: 'Elections',
            select: 'title cover condidates',
            populate: {
              path: 'condidates',
              model: 'Condidates',
              select: 'user votes',
              populate: {
                path: 'user',
                model: 'Users',
                select: 'name profileImage'
              }
            }
          }
        }
      ).populate(
        {
          path: 'elections',
          populate: {
            path: 'votes',
            model: 'Condidates',
            select: 'name'

          }
        }
      );

    if (!user) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 404,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 404,
            type: ResponseMessageType.error,
            message: 'کاربر یافت نشد',
            alertUser: true
          })
        ]
      });
    }

    const election = user[0].elections;

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: election,
      message: [
        new ResponseMessage({
          eventId: 200,
          type: ResponseMessageType.success,
          message: 'success get',
          alertUser: false
        })
      ]
    });
  }

  async getAllAdminUsersService() {
    const admins = await User.find({ isAdmin: true }).select("name melliCode profileImage _id");
    if (admins.length === 0) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 404,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 404,
            type: ResponseMessageType.error,
            message: 'ادمینی یافت نشد',
            alertUser: true
          })
        ]
      });
    }

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: admins,
      message: [
        new ResponseMessage({
          eventId: 200,
          type: ResponseMessageType.success,
          message: 'success get',
          alertUser: false
        })
      ]
    });
  }

  async setUserAdminService(melliCode) {
    const user = await User.findOne({ melliCode: melliCode });
    if (!user) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 404,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 404,
            type: ResponseMessageType.error,
            message: 'کاربر یافت نشد',
            alertUser: true
          })
        ]
      });
    }
    console.error(user)


    user.isAdmin = true;

    const result = await user.save();

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: result,
      message: [
        new ResponseMessage({
          eventId: 200,
          type: ResponseMessageType.success,
          message: 'کاربر ادمین شد',
          alertUser: true
        })
      ]
    });
  }

  async unSetUserAdminService(melliCode) {
    const user = await User.findOne({ melliCode: melliCode });
    if (!user) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 404,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 404,
            type: ResponseMessageType.error,
            message: 'کاربر یافت نشد',
            alertUser: true
          })
        ]
      });
    }

    user.isAdmin = false;

    const result = await user.save();

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: result,
      message: [
        new ResponseMessage({
          eventId: 200,
          type: ResponseMessageType.success,
          message: 'کاربر از ادمین بودن خارج شد. ',
          alertUser: true
        })
      ]
    });
  }
}

module.exports = UserService;