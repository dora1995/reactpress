import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SettingService } from '../setting/setting.service';
import { sendEmail } from '../../utils/sms';
import { SMTP } from './smtp.entity';

@Injectable()
export class SMTPService {
  constructor(
    @InjectRepository(SMTP)
    private readonly smtpRepository: Repository<SMTP>,
  ) {}

  /**
   * 添加邮件，发送邮件并保存
   * @param SMTP
   */
  async create(data: Partial<SMTP>) {
    const { to, subject, text } = data;
    await sendEmail(to, subject, text).catch(() => {
      throw new HttpException('邮件发送失败', HttpStatus.BAD_REQUEST);
    }); 
  }

  /**
   * 获取所有邮件
   */
  async findAll(queryParams): Promise<[SMTP[], number]> {
    const query = this.smtpRepository.createQueryBuilder('smtp').orderBy('smtp.createAt', 'DESC');

    if (typeof queryParams === 'object') {
      const { page = 1, pageSize = 12, ...otherParams } = queryParams;
      query.skip((+page - 1) * +pageSize);
      query.take(+pageSize);

      if (otherParams) {
        Object.keys(otherParams).forEach((key) => {
          query.andWhere(`smtp.${key} LIKE :${key}`).setParameter(`${key}`, `%${otherParams[key]}%`);
        });
      }
    }

    return query.getManyAndCount();
  }

  /**
   * 删除邮件
   * @param id
   */
  async deleteById(id) {
    const SMTP = await this.smtpRepository.findOne(id);
    return this.smtpRepository.remove(SMTP);
  }
}
