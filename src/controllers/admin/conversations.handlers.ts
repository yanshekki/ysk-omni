import type { Request, Response } from 'express';
import { AUDIT_ACTIONS } from '../../config/constants';
import type {
  ConversationListQueryDto,
  CreateConversationDto,
  UpdateConversationDto,
} from '../../dto/conversation.dto';
import { ExceptionFactory } from '../../exceptions/exception.factory';
import { asyncHandler } from '../../utils/async-handler';
import { auditService } from '../../services/audit.service';
import { conversationService } from '../../services/conversation.service';
import { requestIp } from '../../utils/client-ip';

/** Admin handlers: conversations */
export const adminConversationsHandlers = {
  listConversations: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as ConversationListQueryDto;
    const data = await conversationService.list(query);
    res.json({ object: 'list', ...data });
  }),

  getConversation: asyncHandler(async (req: Request, res: Response) => {
    const data = await conversationService.getById(String(req.params.id));
    res.json({ object: 'admin.conversation', data });
  }),

  createConversation: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const body = req.body as CreateConversationDto;
    const data = await conversationService.create(body);
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.CONVERSATION_CREATE,
      resource: 'conversation',
      resourceId: data.id,
      meta: { messageCount: data.messageCount, title: data.title },
      ip: requestIp(req),
    });
    res.status(201).json({ object: 'admin.conversation', data });
  }),

  updateConversation: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const body = req.body as UpdateConversationDto;
    const data = await conversationService.update(String(req.params.id), body);
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.CONVERSATION_UPDATE,
      resource: 'conversation',
      resourceId: data.id,
      meta: {
        title: data.title,
        messageCount: data.messageCount,
        fields: Object.keys(body),
      },
      ip: requestIp(req),
    });
    res.json({ object: 'admin.conversation', data });
  }),

  deleteConversation: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const id = String(req.params.id);
    const data = await conversationService.remove(id);
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.CONVERSATION_DELETE,
      resource: 'conversation',
      resourceId: id,
      ip: requestIp(req),
    });
    res.json({ object: 'admin.conversation.deleted', data });
  }),

};
