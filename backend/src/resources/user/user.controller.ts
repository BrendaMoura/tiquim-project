import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { CreateUserDto, TypeUser, UpdateUserDto } from "./user.types";
import { createUser, deleteUser, listUsers, readUser, updateUser } from "./user.service";
import fs from "fs";
import path from "path";

const index = async (req: Request, res: Response) => {
  /*
  #swagger.summary = 'Lista todos os usuários.'
  #swagger.responses[200] = {
  schema: { $ref: '#/definitions/User' }
  }
  */
  const skip = req.query.skip ? parseInt(req.query.skip.toString()) : undefined;
  const take = req.query.take ? parseInt(req.query.take.toString()) : undefined;
  try {
    const user = await listUsers(skip, take);
    res.status(StatusCodes.OK).json(user);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

const create = async (req: Request, res: Response) => {
  const user = req.body as CreateUserDto;
  const userType = req.query.userType as TypeUser;
  try {
    /*
    #swagger.summary = 'Cria um usuário novo.'
    #swagger.parameters['userType'] = { description: 'Tipo do usuário' }
    #swagger.parameters['body'] = {
    in: 'body',
    schema: { $ref: '#/definitions/CreateUserDto' }
    }
    #swagger.responses[200] = {
    schema: { $ref: '#/definitions/User' }
    }
    */
    if (req.file) {
      user.avatarUrl = req.file.filename;
    }

    const newUser = await createUser(user, userType);
    res.status(StatusCodes.OK).json(newUser);
  } catch (err) {
    console.log(err)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

const read = async (req: Request, res: Response) => {
  /*
  #swagger.summary = 'Mostra um usuário com base no ID.'
  #swagger.parameters['id'] = { description: 'ID do usuário' }
  #swagger.responses[200] = {
  schema: { $ref: '#/definitions/Usuario' }
  }
  */
  const { id } = req.params;
  try {
    const user = await readUser(id);
    if (!user) return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
    res.status(StatusCodes.OK).json(user);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

const update = async (req: Request, res: Response) => {
  /*
  #swagger.summary = 'Modifica os atributos de um usuário.'
  #swagger.parameters['id'] = { description: 'ID do usuário' }
  #swagger.parameters['body'] = {
  in: 'body',
  schema: { $ref: '#/definitions/UpdateUsuarioDto' }
  }
  #swagger.responses[200] = {
  schema: { $ref: '#/definitions/Usuario' }
  }
  */
  const { id } = req.params;
  const user = req.body as UpdateUserDto;

  if (req.file) {
    const oldImageUrl = user.avatarUrl;

    if (oldImageUrl) {
      const filePath = path.join(__dirname, "..", "..", "uploads", "campaigns", oldImageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    user.avatarUrl = req.file.filename;
  }

  try {
    const updatedUser = await updateUser(id, user);
    res.status(StatusCodes.NO_CONTENT).json();
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

const remove = async (req: Request, res: Response) => {
  /*
  #swagger.summary = 'Apaga um usuário com base no ID.'
  #swagger.parameters['id'] = { description: 'ID do usuário' }
  */
  const { id } = req.params;
  try {
    const deletedProduct = await deleteUser(id);
    const oldImageUrl = deletedProduct.avatarUrl;

    if (oldImageUrl) {
      const filePath = path.join(__dirname, "..", "..", "uploads", "campaigns", oldImageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(StatusCodes.NO_CONTENT).json();
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

export default { index, create, read, update, remove };