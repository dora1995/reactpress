import React, { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Typography,
  Tabs,
  message,
  Space,
  Divider,
} from 'antd';
import {
  SaveOutlined,
  SettingOutlined,
  GlobalOutlined,
  MailOutlined,
  CloudOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { settingAPI } from '../services/api';
import type { Setting } from '../types/api';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface SettingsForm {
  // 基础设置
  siteName: string;
  siteDescription: string;
  siteKeywords: string;
  siteLogo: string;
  siteFavicon: string;
  
  // SEO设置
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  
  // SMTP设置
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpSecure: boolean;
  
  // OSS设置
  ossProvider: string;
  ossAccessKey: string;
  ossSecretKey: string;
  ossBucket: string;
  ossRegion: string;
  
  // 分析设置
  analyticsCode: string;
  enableAnalytics: boolean;
  
  // 其他设置
  enableComment: boolean;
  enableRegister: boolean;
  commentNeedApproval: boolean;
}

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const settings = await settingAPI.getSettings();
      
      // 将设置数据转换为表单格式
      const formData: any = {};
      if (settings && typeof settings === 'object') {
        // 假设后端返回的是键值对格式
        Object.entries(settings).forEach(([key, value]) => {
          formData[key] = value;
        });
      }
      
      form.setFieldsValue(formData);
    } catch (error) {
      message.error('获取设置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: SettingsForm) => {
    setSaveLoading(true);
    try {
      await settingAPI.updateSettings(values);
      message.success('设置保存成功');
    } catch (error) {
      message.error('保存设置失败');
    } finally {
      setSaveLoading(false);
    }
  };

  const tabItems = [
    {
      key: 'basic',
      label: (
        <span>
          <SettingOutlined />
          基础设置
        </span>
      ),
      children: (
        <div className="space-y-6">
          <Card title="站点信息" size="small">
            <Form.Item
              name="siteName"
              label="站点名称"
              rules={[{ required: true, message: '请输入站点名称' }]}
            >
              <Input placeholder="请输入站点名称" />
            </Form.Item>

            <Form.Item
              name="siteDescription"
              label="站点描述"
            >
              <TextArea
                placeholder="请输入站点描述"
                rows={3}
              />
            </Form.Item>

            <Form.Item
              name="siteKeywords"
              label="站点关键词"
            >
              <Input placeholder="请输入站点关键词，用逗号分隔" />
            </Form.Item>

            <Form.Item
              name="siteLogo"
              label="站点Logo"
            >
              <Input placeholder="请输入Logo URL" />
            </Form.Item>

            <Form.Item
              name="siteFavicon"
              label="站点图标"
            >
              <Input placeholder="请输入Favicon URL" />
            </Form.Item>
          </Card>

          <Card title="功能设置" size="small">
            <Form.Item
              name="enableComment"
              label="启用评论功能"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="commentNeedApproval"
              label="评论需要审核"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="enableRegister"
              label="允许用户注册"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Card>
        </div>
      ),
    },
    {
      key: 'seo',
      label: (
        <span>
          <GlobalOutlined />
          SEO设置
        </span>
      ),
      children: (
        <Card title="SEO优化" size="small">
          <Form.Item
            name="seoTitle"
            label="SEO标题"
          >
            <Input placeholder="请输入SEO标题" />
          </Form.Item>

          <Form.Item
            name="seoDescription"
            label="SEO描述"
          >
            <TextArea
              placeholder="请输入SEO描述"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="seoKeywords"
            label="SEO关键词"
          >
            <Input placeholder="请输入SEO关键词，用逗号分隔" />
          </Form.Item>
        </Card>
      ),
    },
    {
      key: 'smtp',
      label: (
        <span>
          <MailOutlined />
          邮件设置
        </span>
      ),
      children: (
        <Card title="SMTP配置" size="small">
          <Form.Item
            name="smtpHost"
            label="SMTP服务器"
          >
            <Input placeholder="请输入SMTP服务器地址" />
          </Form.Item>

          <Form.Item
            name="smtpPort"
            label="SMTP端口"
          >
            <Input type="number" placeholder="请输入SMTP端口" />
          </Form.Item>

          <Form.Item
            name="smtpUser"
            label="SMTP用户名"
          >
            <Input placeholder="请输入SMTP用户名" />
          </Form.Item>

          <Form.Item
            name="smtpPassword"
            label="SMTP密码"
          >
            <Input.Password placeholder="请输入SMTP密码" />
          </Form.Item>

          <Form.Item
            name="smtpSecure"
            label="启用SSL"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Card>
      ),
    },
    {
      key: 'oss',
      label: (
        <span>
          <CloudOutlined />
          存储设置
        </span>
      ),
      children: (
        <Card title="对象存储配置" size="small">
          <Form.Item
            name="ossProvider"
            label="存储提供商"
          >
            <Select placeholder="选择存储提供商">
              <Option value="aliyun">阿里云OSS</Option>
              <Option value="qiniu">七牛云</Option>
              <Option value="tencent">腾讯云COS</Option>
              <Option value="local">本地存储</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="ossAccessKey"
            label="Access Key"
          >
            <Input placeholder="请输入Access Key" />
          </Form.Item>

          <Form.Item
            name="ossSecretKey"
            label="Secret Key"
          >
            <Input.Password placeholder="请输入Secret Key" />
          </Form.Item>

          <Form.Item
            name="ossBucket"
            label="存储桶名称"
          >
            <Input placeholder="请输入存储桶名称" />
          </Form.Item>

          <Form.Item
            name="ossRegion"
            label="存储区域"
          >
            <Input placeholder="请输入存储区域" />
          </Form.Item>
        </Card>
      ),
    },
    {
      key: 'analytics',
      label: (
        <span>
          <BarChartOutlined />
          统计分析
        </span>
      ),
      children: (
        <Card title="统计分析配置" size="small">
          <Form.Item
            name="enableAnalytics"
            label="启用统计分析"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="analyticsCode"
            label="统计代码"
          >
            <TextArea
              placeholder="请输入Google Analytics或百度统计代码"
              rows={6}
            />
          </Form.Item>

          <Paragraph type="secondary" className="mt-2">
            支持Google Analytics、百度统计等第三方统计服务的跟踪代码。
          </Paragraph>
        </Card>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Title level={2} className="mb-0">
          系统设置
        </Title>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={saveLoading}
          onClick={() => form.submit()}
        >
          保存设置
        </Button>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            enableComment: true,
            commentNeedApproval: true,
            enableRegister: false,
            enableAnalytics: false,
            smtpSecure: true,
            smtpPort: 587,
            ossProvider: 'local',
          }}
        >
          <Tabs
            items={tabItems}
            size="large"
            tabPosition="left"
            style={{ minHeight: 400 }}
          />
        </Form>
      </Card>
    </div>
  );
};

export default Settings;