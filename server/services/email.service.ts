import _ from 'lodash';
import type { FindOneOptions } from 'typeorm';
import appDataSource from '../database/config/app.datasource';
import { EmailGroup } from '../database/entities/emails/email-groups.entity';
import { EmailRecipient } from '../database/entities/emails/email-recipients.entity';
import { Email } from '../database/entities/emails/email.entity';
import type {
  EmailGroupDto,
  EmailRecipientDto,
} from '../dtos/emails/create-email.dto';
import { RecipientType } from '../enums/recipient-type.enum';
import { SendingStatus } from '../enums/sending-status.enum';
import Queue from '../utils/queue';
import type { CreateEmailDto } from '../validations/emails/create.dto';
import type { UpdateEmailDto } from '../validations/emails/update.dto';
import { BaseService } from './base.service';

export class EmailService extends BaseService<Email> {
  constructor() {
    super();
    this.repository = appDataSource.getRepository(Email);
  }

  async findOne(
    id: number,
    overrideOptions?: FindOneOptions<Email>,
  ): Promise<Email> {
    const user = await getCurrentUser(this.event);

    return super.findOne(id, {
      ...overrideOptions,
      where: {
        tenantId: user.tenantId,
      },
      relations: { medias: true, recipients: true, groups: true, sender: true },
    });
  }

  async createEmail(body: CreateEmailDto) {
    const user = await getCurrentUser(this.event);
    const sender = user;
    const { recipients, groups, ...emailObject } = body;
    const email = await super.create({
      ...emailObject,
      tenantId: user.tenantId,
      creator: user,
      sender,
      sendingStatus: SendingStatus.PENDING,
    });

    if (!body.isPredefined) {
      await this.recipientBind(recipients!, email);
      await this.groupBind(groups!, email);
    }

    Queue.enqueue(() => this.sendEmail(email.id));

    return email;
  }

  async sendEmail(emailId: number) {
    const config = useRuntimeConfig();
    console.log('processing', { emailId });

    if (config.functionEmail) {
      await $fetch(config.functionEmail, {
        params: {
          id: emailId,
        },
        onResponseError(context) {
          console.warn('error sending email', context.error);
        },
      });

      console.log('processed', { emailId });
    }
  }

  async recipientBind(
    recipients: EmailRecipientDto,
    email: Email,
  ): Promise<void> {
    await Promise.all(
      recipients[RecipientType.TO].map((recipientId: number) => {
        const emailRecipientForTo = new EmailRecipient();
        emailRecipientForTo.emailId = email.id;
        emailRecipientForTo.recipientId = recipientId;
        emailRecipientForTo.recipientType = RecipientType.TO;

        return this.repository.manager.save(emailRecipientForTo);
      }),
    );

    await Promise.all(
      recipients[RecipientType.CC].map((recipientId: number) => {
        const emailRecipientForCc = new EmailRecipient();
        emailRecipientForCc.emailId = email.id;
        emailRecipientForCc.recipientId = recipientId;
        emailRecipientForCc.recipientType = RecipientType.CC;

        return this.repository.manager.save(emailRecipientForCc);
      }),
    );

    await Promise.all(
      recipients[RecipientType.BCC].map((recipientId: number) => {
        const emailRecipientForBcc = new EmailRecipient();
        emailRecipientForBcc.emailId = email.id;
        emailRecipientForBcc.recipientId = recipientId;
        emailRecipientForBcc.recipientType = RecipientType.BCC;

        return this.repository.manager.save(emailRecipientForBcc);
      }),
    );
  }

  async groupBind(groups: EmailGroupDto, email: Email): Promise<void> {
    await Promise.all(
      groups[RecipientType.TO].map((groupId: number) => {
        const emailGroupForTo = new EmailGroup();
        emailGroupForTo.emailId = email.id;
        emailGroupForTo.groupId = groupId;
        emailGroupForTo.groupType = RecipientType.TO;

        return this.repository.manager.save(emailGroupForTo);
      }),
    );

    await Promise.all(
      groups[RecipientType.CC].map((groupId: number) => {
        const emailGroupForCc = new EmailGroup();
        emailGroupForCc.emailId = email.id;
        emailGroupForCc.groupId = groupId;
        emailGroupForCc.groupType = RecipientType.CC;

        return this.repository.manager.save(emailGroupForCc);
      }),
    );

    await Promise.all(
      groups[RecipientType.BCC].map((groupId: number) => {
        const emailGroupForBcc = new EmailGroup();
        emailGroupForBcc.emailId = email.id;
        emailGroupForBcc.groupId = groupId;
        emailGroupForBcc.groupType = RecipientType.BCC;

        return this.repository.manager.save(emailGroupForBcc);
      }),
    );
  }

  async updateEmail(id: number, body: UpdateEmailDto) {
    const sender = await getCurrentUser(this.event);
    const emailObject = _.omit(body, ['recipients', 'groups']);

    return super.update(id, {
      ...emailObject,
      sender,
      sendingStatus: SendingStatus.PENDING,
    });
  }

  delete(id: number) {
    return this.repository.softDelete(id);
  }

  bulkDelete(ids: number[]) {
    return this.repository.softDelete(ids);
  }
}
