import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { CreateUserDto, TypeUser, UserDto } from "./user.types";
import { createUser, deleteUser, listUsers, readUser, updateUser } from "./user.service";

const index = async (req: Request, res: Response) => {
  /*
  #swagger.summary = 'Lista todos os usuário.'
  #swagger.responses[200] = {
  schema: { $ref: '#/definitions/Usuario' }
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
  const userType = req.query.tipoUsuario as TypeUser;
  try {
    /*
    #swagger.summary = 'Cria um usuário novo.'
    #swagger.parameters['tipoUsuario'] = { description: 'Tipo do usuário' }
    #swagger.parameters['body'] = {
    in: 'body',
    schema: { $ref: '#/definitions/CreateUsuarioDto' }
    }
    #swagger.responses[200] = {
    schema: { $ref: '#/definitions/Usuario' }
    }
    */
    const newUser = await createUser(user, userType);
    res.status(StatusCodes.OK).json(newUser);
  } catch (err) {
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
  const product = req.body as UserDto;
  try {
    const updatedProduto = await updateUser(id, product);
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
    res.status(StatusCodes.NO_CONTENT).json();
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

export default { index, create, read, update, remove };
