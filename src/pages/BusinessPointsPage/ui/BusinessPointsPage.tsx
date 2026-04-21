import React, { useState } from 'react';
import {
  ClockCircleOutlined,
  InfoCircleFilled,
  LineChartOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Card, Col, Empty, List, Row, Select, Switch, Table, Tabs, Tag, Typography } from 'antd';
import type { TableColumnsType } from 'antd';

import styles from './BusinessPointsPage.module.scss';

type DashboardState = 'no-company' | 'company-empty' | 'filled';

const hasCompany = false;
const hasMonitoringData = false;
const ordersInProgressIcon = 'https://www.figma.com/api/mcp/asset/475dea13-84a9-4aad-9376-9a2debb752fa';

const pageState: DashboardState = !hasCompany ? 'no-company' : hasMonitoringData ? 'filled' : 'company-empty';

const monitoringCardsByState: Record<
  DashboardState,
  Array<{ title: string; value: string; icon: React.ReactNode; muted?: boolean; imageSrc?: string }>
> = {
  'no-company': [
    { title: 'Активные сессии', value: '0', icon: <LineChartOutlined />, muted: true },
    { title: 'Операторов на смене', value: '0', icon: <TeamOutlined />, muted: true },
    { title: 'Клиентов в очередях', value: '0', icon: <ClockCircleOutlined />, muted: true },
    { title: 'Заказов в процессе', value: '0', icon: <ShoppingCartOutlined />, muted: true, imageSrc: ordersInProgressIcon },
  ],
  'company-empty': [
    { title: 'Активные сессии', value: '0', icon: <LineChartOutlined /> },
    { title: 'Операторов на смене', value: '0', icon: <TeamOutlined /> },
    { title: 'Клиентов в очередях', value: '0', icon: <ClockCircleOutlined /> },
    { title: 'Заказов в процессе', value: '0', icon: <ShoppingCartOutlined />, imageSrc: ordersInProgressIcon },
  ],
  filled: [
    { title: 'Активные сессии', value: '8 из 12', icon: <LineChartOutlined /> },
    { title: 'Операторов на смене', value: '24', icon: <TeamOutlined /> },
    { title: 'Клиентов в очередях', value: '156', icon: <ClockCircleOutlined /> },
    { title: 'Заказов в процессе', value: '156', icon: <ShoppingCartOutlined />, imageSrc: ordersInProgressIcon },
  ],
};

const kpiCards = [
  'Всего обращений',
  'Кол-во завершенных обращений',
  'Кол-во отменённых обращений',
  'Среднее время обработки одного обращения',
  'Среднее время ожидания в очереди',
];

interface BusinessPointRow {
  key: number;
  name: string;
  address: string;
  load: string;
  sessionStatus: string;
  operators: number;
  clients: number;
  waitQueue: string;
  waitOrders: string;
  orders: number;
  issues: string;
}

const businessPointColumns: TableColumnsType<BusinessPointRow> = [
  {
    title: 'Бизнес-точка',
    dataIndex: 'name',
    key: 'name',
    render: (_: unknown, row: BusinessPointRow) => (
      <div>
        <div className={styles.bpName}>{row.name}</div>
        <div className={styles.bpAddress}>{row.address}</div>
      </div>
    ),
  },
  {
    title: 'Загруженность',
    dataIndex: 'load',
    key: 'load',
    render: (value: string) => {
      const loadClass =
        value === '95%' ? styles.loadHigh : value === '75%' ? styles.loadMedium : value === '60%' ? styles.loadLow : styles.loadGood;
      return <span className={`${styles.bpLoadValue} ${loadClass}`}>{value}</span>;
    },
  },
  {
    title: 'Статус сессии',
    dataIndex: 'sessionStatus',
    key: 'sessionStatus',
    render: (value: string) => (
      <Tag className={value === 'Не активна' ? styles.inactiveTag : styles.activeTag}>{value}</Tag>
    ),
  },
  { title: 'Операторы', dataIndex: 'operators', key: 'operators' },
  { title: 'Клиенты в очереди', dataIndex: 'clients', key: 'clients' },
  { title: 'Ср. ожидание в очереди', dataIndex: 'waitQueue', key: 'waitQueue' },
  { title: 'Ср. ожидание заказов', dataIndex: 'waitOrders', key: 'waitOrders' },
  { title: 'Заказы в работе', dataIndex: 'orders', key: 'orders' },
  {
    title: 'Проблемы',
    dataIndex: 'issues',
    key: 'issues',
    render: (value: string) =>
      value === 'Ожидание > 15 мин' ? (
        <Tag className={styles.problemHintTag}>{value}</Tag>
      ) : (
        <span className={value === '3 проблемы' ? styles.problemCount : ''}>{value}</span>
      ),
  },
];

const businessPointRows: BusinessPointRow[] = [
  {
    key: 1,
    name: 'Шиномонтаж "Макси"',
    address: 'г. Москва, ул Октябрь, д.6',
    load: '95%',
    sessionStatus: 'Активна',
    operators: 1,
    clients: 3,
    waitQueue: '4.2 мин',
    waitOrders: '4.2 мин',
    orders: 2,
    issues: '—',
  },
  {
    key: 2,
    name: 'Шиномонтаж "Макси"',
    address: 'г. Москва, ул Октябрь, д.6',
    load: '75%',
    sessionStatus: 'Активна',
    operators: 1,
    clients: 3,
    waitQueue: '4.2 мин',
    waitOrders: '4.2 мин',
    orders: 2,
    issues: 'Ожидание > 15 мин',
  },
  {
    key: 3,
    name: 'Шиномонтаж "Макси"',
    address: 'г. Москва, ул Октябрь, д.6',
    load: '60%',
    sessionStatus: 'Активна',
    operators: 1,
    clients: 3,
    waitQueue: '4.2 мин',
    waitOrders: '4.2 мин',
    orders: 2,
    issues: '—',
  },
  {
    key: 4,
    name: 'Шиномонтаж "Макси"',
    address: 'г. Москва, ул Октябрь, д.6',
    load: '15%',
    sessionStatus: 'Не активна',
    operators: 1,
    clients: 3,
    waitQueue: '4.2 мин',
    waitOrders: '4.2 мин',
    orders: 2,
    issues: '3 проблемы',
  },
];

type LastActionState = 'empty' | 'single' | 'many';

const lastActionStateByPageState: Record<DashboardState, LastActionState> = {
  'no-company': 'empty',
  'company-empty': 'single',
  filled: 'many',
};

const lastActions = [
  { id: 1, title: 'Клиент отменил обращение #1583', subtitle: 'Шиномонтаж "Макси" - Петров Петр', time: '09:45 03.10.2025' },
  { id: 2, title: 'Клиент отменил обращение #1583', subtitle: 'Шиномонтаж "Макси" - Петров Петр', time: '09:45 03.10.2025' },
  { id: 3, title: 'Клиент отменил обращение #1583', subtitle: 'Шиномонтаж "Макси" - Петров Петр', time: '09:45 03.10.2025' },
];

const businessPointFilterOptions = [
  { value: 'all', label: 'Все' },
  { value: 'negative', label: 'Негативные' },
  { value: 'positive', label: 'Позитивные' },
];

type ActiveShiftsState = 'empty' | 'filled';

const activeShiftsStateByPageState: Record<DashboardState, ActiveShiftsState> = {
  'no-company': 'empty',
  'company-empty': 'empty',
  filled: 'filled',
};

const activeShiftsRows = [
  { id: 1, shift: '#54B8', point: 'Шиномонтаж "Макси"', address: 'г. Москва, ул Октябрь, д.6', employee: 'Иван Петров' },
  { id: 2, shift: '#54B8', point: 'Шиномонтаж "Макси"', address: 'г. Москва, ул Октябрь, д.6', employee: 'Иван Петров' },
  { id: 3, shift: '#54B8', point: 'Шиномонтаж "Макси"', address: 'г. Москва, ул Октябрь, д.6', employee: 'Иван Петров' },
];

const breakShiftsRows = [{ id: 4, shift: '#77P2', point: 'Шиномонтаж "Макси"', address: 'г. Москва, ул Октябрь, д.6', employee: 'Олег Иванов' }];

const noDataSvg = (
  <svg width="180" height="116" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg" aria-label="Нет данных">
    <title>Нет данных</title>
    <g transform="translate(0 1)" fill="none" fillRule="evenodd">
      <ellipse fill="#F5F5F5" cx="32" cy="33" rx="32" ry="7" />
      <g fillRule="nonzero" stroke="#8FA3B5" strokeWidth="1.8">
        <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z" />
        <path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" fill="#FAFAFA" />
      </g>
    </g>
  </svg>
);

export const BusinessPointsPage: React.FC = () => {
  const monitoringCards = monitoringCardsByState[pageState];
  const isConnected = pageState !== 'no-company';
  const lastActionState = lastActionStateByPageState[pageState];
  const activeShiftsState = activeShiftsStateByPageState[pageState];
  const [shiftTab, setShiftTab] = useState<'active' | 'break'>('active');
  const currentShiftRows = shiftTab === 'active' ? activeShiftsRows : breakShiftsRows;
  const renderAddBusinessPointButton = (disabled: boolean) => (
    <button type="button" disabled={disabled} className={`${styles.addBusinessPointBtn} ${disabled ? styles.addBusinessPointBtnDisabled : ''}`}>
      <span className={styles.addBusinessPointPlus}>+</span> Добавить бизнес-точку
    </button>
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div>
            <h1>Компания еще не добавлена</h1>
            <p>Подключите юридическое лицо, к которому будут привязаны ваши точки</p>
          </div>
          <button type="button" className={styles.addCompanyBtn}>
            Добавить компанию
          </button>
        </div>
      </section>

      <main className={styles.container}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Live мониторинг</h2>
            <div className={`${styles.status} ${!isConnected ? styles.statusDisconnected : ''}`}>
              <span className={styles.statusDot} />
              <span>{isConnected ? 'Подключено' : 'Не подключено'}</span>
              <InfoCircleFilled className={styles.statusInfoIcon} />
            </div>
          </div>

          <Row gutter={[20, 20]} className={styles.monitoringGrid}>
            {monitoringCards.map((item) => (
              <Col key={item.title} xs={24} sm={12} lg={6}>
                <Card
                  className={`${styles.metricCard} ${item.muted ? styles.metricCardMuted : ''}`}
                  bordered={false}
                  bodyStyle={{ padding: 20 }}
                >
                  <div className={`${styles.metricIcon} ${item.muted ? styles.metricIconMuted : ''}`}>
                    {item.imageSrc ? <img src={item.imageSrc} alt={item.title} className={styles.metricIconImage} /> : item.icon}
                  </div>
                  <div>
                    <Typography.Paragraph className={styles.metricTitle}>{item.title}</Typography.Paragraph>
                    <Typography.Text className={styles.metricValue}>{item.value}</Typography.Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {pageState === 'no-company' ? (
            <article className={styles.businessPointsCard}>
              <div className={styles.rowHeader}>
                <h3>Мои бизнес-точки (0)</h3>
                {renderAddBusinessPointButton(true)}
              </div>
              <div className={styles.centerEmpty}>
                Чтобы добавить бизнес-точку, необходимо предварительно зарегистрировать компанию.
              </div>
            </article>
          ) : null}

          {pageState === 'company-empty' ? (
            <article className={styles.businessPointsCard}>
              <div className={styles.rowHeader}>
                <h3>Мои бизнес-точки (4)</h3>
                {renderAddBusinessPointButton(false)}
              </div>
              <div className={styles.bpFilters}>
                <div className={styles.bpFilterItem}>
                  <span>Статус:</span>
                  <Select defaultValue="Все" options={[{ value: 'Все', label: 'Все' }]} />
                </div>
                <div className={styles.bpFilterItem}>
                  <span>Загруженность:</span>
                  <Select defaultValue="Все" options={[{ value: 'Все', label: 'Все' }]} />
                </div>
                <div className={styles.bpFilterSwitch}>
                  <span>Только проблемные</span>
                  <Switch size="small" />
                </div>
              </div>
              <div className={styles.centerEmpty}>Для продолжения работы добавьте бизнес-точку</div>
            </article>
          ) : null}

          {pageState === 'filled' ? (
            <article className={styles.businessPointsCard}>
              <div className={styles.rowHeader}>
                <h3>Мои бизнес-точки (4)</h3>
                {renderAddBusinessPointButton(false)}
              </div>
              <div className={styles.bpFilters}>
                <div className={styles.bpFilterItem}>
                  <span>Статус:</span>
                  <Select defaultValue="Все" options={[{ value: 'Все', label: 'Все' }]} />
                </div>
                <div className={styles.bpFilterItem}>
                  <span>Загруженность:</span>
                  <Select defaultValue="Все" options={[{ value: 'Все', label: 'Все' }]} />
                </div>
                <div className={styles.bpFilterSwitch}>
                  <span>Только проблемные</span>
                  <Switch size="small" defaultChecked />
                </div>
              </div>

              <Table
                className={styles.bpTable}
                columns={businessPointColumns}
                dataSource={businessPointRows}
                pagination={false}
                size="small"
              />
            </article>
          ) : null}

          <div className={styles.twoColumns}>
            <article className={styles.smallCard}>
              <div className={styles.rowHeader}>
                <h3>Последние действия</h3>
                <span className={styles.rowHeaderStaticAction}>Все действия</span>
              </div>
              <div className={styles.actionFilterRow}>
                <span>Бизнес-точка</span>
                <Select
                  defaultValue="all"
                  options={businessPointFilterOptions}
                  className={styles.actionSelect}
                  popupClassName="bp-filter-dropdown"
                />
              </div>

              {lastActionState === 'empty' ? (
                <div className={styles.panelEmptyWrap}>
                  <Empty className={styles.noDataEmpty} description="Нет данных" image={noDataSvg} />
                </div>
              ) : null}

              {lastActionState === 'single' ? (
                <List
                  className={styles.actionsList}
                  dataSource={lastActions.slice(0, 1)}
                  renderItem={(item) => {
                    return (
                      <List.Item className={styles.actionListItem}>
                        <div>
                          <div className={styles.actionTitle}>{item.title}</div>
                          <div className={styles.actionSubtitle}>{item.subtitle}</div>
                        </div>
                        <div className={styles.actionTime}>{item.time}</div>
                      </List.Item>
                    );
                  }}
                />
              ) : null}

              {lastActionState === 'many' ? (
                <div className={styles.actionsScrollWrap}>
                  <List
                    className={styles.actionsList}
                    dataSource={lastActions}
                    renderItem={(item) => {
                      return (
                        <List.Item className={styles.actionListItem}>
                          <div>
                            <div className={styles.actionTitle}>{item.title}</div>
                            <div className={styles.actionSubtitle}>{item.subtitle}</div>
                          </div>
                          <div className={styles.actionTime}>{item.time}</div>
                        </List.Item>
                      );
                    }}
                  />
                </div>
              ) : null}
            </article>

            <article className={styles.smallCard}>
              <div className={styles.rowHeader}>
                <h3>Активные смены</h3>
                <span className={styles.rowHeaderStaticAction}>Все смены</span>
              </div>
              <div className={styles.actionFilterRow}>
                <span>Бизнес-точка</span>
                <Select
                  defaultValue="all"
                  options={businessPointFilterOptions}
                  className={styles.actionSelectSmall}
                  popupClassName="bp-filter-dropdown"
                />
                <Tabs
                  activeKey={shiftTab}
                  onChange={(key) => setShiftTab(key as 'active' | 'break')}
                  items={[
                    { key: 'active', label: 'Активные' },
                    { key: 'break', label: 'Перерыв' },
                  ]}
                  className={styles.shiftsTabsAnt}
                />
              </div>

              {activeShiftsState === 'empty' ? (
                <div className={styles.panelEmptyWrap}>
                  <Empty className={styles.noDataEmpty} description="Нет данных" image={noDataSvg} />
                </div>
              ) : null}

              {activeShiftsState === 'filled' ? (
                <div className={styles.shiftsListWrap}>
                  <div className={styles.shiftsHeader}>
                    <span>Смена</span>
                    <span>Бизнес-точка</span>
                    <span>Сотрудник</span>
                  </div>
                  <List
                    className={styles.shiftsList}
                    dataSource={currentShiftRows}
                    renderItem={(item, index) => {
                      return (
                        <List.Item className={`${styles.shiftItem} ${index === 0 ? styles.shiftItemActive : ''}`}>
                          <div className={styles.shiftColId}>{item.shift}</div>
                          <div className={styles.shiftColPoint}>
                            <div className={styles.shiftPointName}>{item.point}</div>
                            <div className={styles.shiftPointAddress}>{item.address}</div>
                          </div>
                          <div className={styles.shiftColEmployee}>{item.employee}</div>
                        </List.Item>
                      );
                    }}
                  />
                </div>
              ) : null}
            </article>
          </div>
        </section>

        <div className={styles.twoColumns}>
          <article className={styles.smallCard}>
            <div className={styles.rowHeader}>
              <h3>Сотрудники</h3>
              <button type="button">Добавить сотрудника</button>
            </div>
            <div className={styles.emptyWrap}>
              <Empty description="Нет данных" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          </article>

          <article className={styles.smallCard}>
            <div className={styles.rowHeader}>
              <h3>Подписки</h3>
              <button type="button">Управление подписками</button>
            </div>
            <div className={styles.tabs}>
              <span className={styles.activeTab}>Обзор</span>
              <span>История платежей</span>
            </div>
            <div className={styles.subscriptionsGrid}>
              <article>
                <p>Всего</p>
                <strong>0</strong>
              </article>
              <article>
                <p>Активные</p>
                <strong>0</strong>
              </article>
              <article>
                <p>Не активные</p>
                <strong>0</strong>
              </article>
            </div>
          </article>
        </div>

        <section className={styles.card}>
          <div className={styles.kpiToolbar}>
            <div className={styles.filterRow}>Бизнес-точка: "Шиномонтаж Макси"</div>
            <div className={styles.filterRow}>Дата: 10.10.2025</div>
            <div className={styles.filterRow}>Сравнивать с: Вчера</div>
          </div>

          <div className={styles.kpiHeader}>
            <h2>KPI-панель</h2>
            <div className={styles.tabs}>
              <span className={styles.activeTab}>Обращения</span>
              <span>Заказы</span>
              <span>Доходы</span>
              <span>Отзывы и качество</span>
              <span>Загруженность</span>
              <span>Персонал</span>
            </div>
          </div>

          <div className={styles.kpiGrid}>
            {kpiCards.map((item) => (
              <article key={item} className={styles.kpiItem}>
                <p>{item}</p>
                <div className={styles.emptyWrap}>
                  <Empty description="Нет данных" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
              </article>
            ))}
          </div>

          <div className={styles.twoColumns}>
            <article className={styles.chartCard}>
              <h3>График обращений по дням</h3>
              <div className={styles.emptyWrap}>
                <Empty description="Нет данных" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            </article>
            <article className={styles.chartCard}>
              <h3>Пиковые часы (сред. знач.)</h3>
              <div className={styles.emptyWrap}>
                <Empty description="Нет данных" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
};
