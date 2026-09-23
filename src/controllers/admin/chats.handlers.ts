import type { Request, Response } from 'express';
import type { AdminListQueryDto } from '../../dto/admin.dto';
import { ExceptionFactory } from '../../exceptions/exception.factory';
import { asyncHandler } from '../../utils/async-handler';
import { chatAdminService } from '../../services/chat-admin.service';
import { requestIp } from '../../utils/client-ip';

/** Admin handlers: chats */
export const adminChatsHandlers = {
  listChats: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as AdminListQueryDto;
    const data = await chatAdminService.list(query);
    res.json({ object: 'list', ...data });
  }),

  getChat: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const data = await chatAdminService.getDetail(
      String(req.params.id),
      req.apiKey.id,
      requestIp(req),
    );
    res.json({ object: 'admin.chat', data });
  }),

};
