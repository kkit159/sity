import React, { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');
import {
  ClockCircleOutlined,
  InfoCircleFilled,
  LineChartOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, DatePicker, Empty, List, Row, Select, Switch, Table, Tabs, Tag, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import { useThemeStore } from '@/app/providers/ThemeProvider';

import styles from './BusinessPointsPage.module.scss';

type DashboardState = 'no-company' | 'company-empty' | 'filled';

const hasCompany = false;
const hasMonitoringData = false;
const pageState: DashboardState = !hasCompany ? 'no-company' : hasMonitoringData ? 'filled' : 'company-empty';

const monitoringCardsByState: Record<
  DashboardState,
  Array<{ title: string; value: string; icon: React.ReactNode; muted?: boolean; imageSrc?: string }>
> = {
  'no-company': [
    { title: 'Активные сессии', value: '0', icon: <LineChartOutlined />, muted: true },
    { title: 'Операторов на смене', value: '0', icon: <TeamOutlined />, muted: true },
    { title: 'Клиентов в очередях', value: '0', icon: <ClockCircleOutlined />, muted: true },
    { title: 'Заказов в процессе', value: '0', icon: <ShoppingCartOutlined />, muted: true },
  ],
  'company-empty': [
    { title: 'Активные сессии', value: '0', icon: <LineChartOutlined /> },
    { title: 'Операторов на смене', value: '0', icon: <TeamOutlined /> },
    { title: 'Клиентов в очередях', value: '0', icon: <ClockCircleOutlined /> },
    { title: 'Заказов в процессе', value: '0', icon: <ShoppingCartOutlined /> },
  ],
  filled: [
    { title: 'Активные сессии', value: '8 из 12', icon: <LineChartOutlined /> },
    { title: 'Операторов на смене', value: '24', icon: <TeamOutlined /> },
    { title: 'Клиентов в очередях', value: '156', icon: <ClockCircleOutlined /> },
    { title: 'Заказов в процессе', value: '156', icon: <ShoppingCartOutlined /> },
  ],
};

/** Пустое / заполненное состояние KPI для всех вкладок; смените на `'hasData'` для заполненного. */
const KPI_TAB_UI_STATE = 'empty' as 'empty' | 'hasData';

type KpiCategoryKey = 'appeals' | 'orders' | 'revenue' | 'reviews' | 'load' | 'staff';

type KpiFilledMetric = { title: string; value: string; delta: string; deltaPositive: boolean };

type KpiCategoryCopy = {
  metricTitles: readonly string[];
  chartTitleLeft: string;
  chartTitleRight: string;
  filledMetrics: KpiFilledMetric[];
};

const KPI_FIGMA_ASSETS = {
  chevron: 'https://www.figma.com/api/mcp/asset/6a5cab5b-beb7-4983-b5c7-f6714ab0faec',
  /** Иконка поля «Дата» + выпадающий календарь (Figma 1:7728). */
  calendar: 'https://www.figma.com/api/mcp/asset/e31c95f7-1fc4-4d2b-8fca-28d82a6ac535',
  refresh: 'https://www.figma.com/api/mcp/asset/e0681b8f-1d07-49aa-8e3a-b80e40839ad0',
  upload: 'https://www.figma.com/api/mcp/asset/6420598c-231f-4f71-ad2b-f7f51eb1c9ca',
  areaChart: 'https://www.figma.com/api/mcp/asset/e040378e-a899-4b3a-917c-a2b59713f62a',
  emptyMetric: 'https://www.figma.com/api/mcp/asset/f3f99480-e6f8-478f-9d43-90a605cf8a41',
  emptyChart: 'https://www.figma.com/api/mcp/asset/3f755e21-1325-42b3-aed6-45befc5afdd6',
} as const;

const KPI_APPEALS_METRIC_TITLES = [
  'Всего обращений',
  'Кол-во завершенных обращений',
  'Кол-во отменённых обращений',
  'Среднее время обработки одного обращения',
  'Среднее время ожидания в очереди',
] as const;

const KPI_APPEALS_METRICS_FILLED: KpiFilledMetric[] = [
  { title: 'Всего обращений', value: '1,247', delta: '+12.5%', deltaPositive: true },
  { title: 'Кол-во завершенных обращений', value: '1,247', delta: '+12.5%', deltaPositive: true },
  { title: 'Кол-во отменённых обращений', value: '877', delta: '-5.2%', deltaPositive: false },
  { title: 'Среднее время обработки одного обращения', value: '13 мин', delta: '-5.2%', deltaPositive: false },
  { title: 'Среднее время ожидания в очереди', value: '25 мин', delta: '+12.5%', deltaPositive: true },
];

/** Тексты по макетам Figma: 1:6499 доходы, 1:6721 отзывы, 1:7043 загруженность, 1:7345 персонал; «Заказы» = «Обращения». */
const KPI_APPEALS_AND_ORDERS_COPY: KpiCategoryCopy = {
  metricTitles: KPI_APPEALS_METRIC_TITLES,
  chartTitleLeft: 'График обращений по дням',
  chartTitleRight: 'Пиковые часы (сред. знач.)',
  filledMetrics: KPI_APPEALS_METRICS_FILLED,
};

const KPI_REVENUE_METRIC_TITLES = [
  'Общий доход',
  'Средний чек',
  'Доход за сегодня',
  'Налоги',
  'Чистая прибыль',
] as const;

const KPI_REVENUE_METRICS_FILLED: KpiFilledMetric[] = [
  { title: 'Общий доход', value: '₽487,320', delta: '+12.5%', deltaPositive: true },
  { title: 'Средний чек', value: '₽3,450', delta: '+12.5%', deltaPositive: true },
  { title: 'Доход за сегодня', value: '₽15,780', delta: '-5.2%', deltaPositive: false },
  { title: 'Налоги', value: '₽73,098', delta: '-5.2%', deltaPositive: false },
  { title: 'Чистая прибыль', value: '₽414,222', delta: '+12.5%', deltaPositive: true },
];

const KPI_REVIEWS_METRIC_TITLES = [
  'Средний рейтинг',
  'Всего отзывов',
  'Положительные',
  'Отрицательные',
  'Качество обслуживания',
] as const;

const KPI_REVIEWS_METRICS_FILLED: KpiFilledMetric[] = [
  { title: 'Средний рейтинг', value: '4.7', delta: '+0.5%', deltaPositive: true },
  { title: 'Всего отзывов', value: '1,532', delta: '+12.5%', deltaPositive: true },
  { title: 'Положительные', value: '1,389', delta: '-5.2%', deltaPositive: false },
  { title: 'Отрицательные', value: '143', delta: '-5.2%', deltaPositive: false },
  { title: 'Качество обслуживания', value: '92%', delta: '+12.5%', deltaPositive: true },
];

const KPI_LOAD_METRIC_TITLES = [
  'Текущая загрузка',
  'Активных сотрудников',
  'Обслужено клиентов',
  'Средняя очередь',
  'Свободных мест',
] as const;

const KPI_LOAD_METRICS_FILLED: KpiFilledMetric[] = [
  { title: 'Текущая загрузка', value: '78%', delta: '+0.5%', deltaPositive: true },
  { title: 'Активных сотрудников', value: '24', delta: '+12.5%', deltaPositive: true },
  { title: 'Обслужено клиентов', value: '156', delta: '-5.2%', deltaPositive: false },
  { title: 'Средняя очередь', value: '3 чел', delta: '-1', deltaPositive: false },
  { title: 'Свободных мест', value: '6', delta: '+12.5%', deltaPositive: true },
];

const KPI_STAFF_METRIC_TITLES = [
  'Всего сотрудников',
  'На смене',
  'Среднее кол-во операторов на смене',
  'Ср кол-во клиентов на оператора',
  'Утилизация операторов',
] as const;

const KPI_STAFF_METRICS_FILLED: KpiFilledMetric[] = [
  { title: 'Всего сотрудников', value: '32', delta: '+2', deltaPositive: true },
  { title: 'На смене', value: '24', delta: '+2', deltaPositive: true },
  { title: 'Среднее кол-во операторов на смене', value: '24', delta: '+2', deltaPositive: true },
  { title: 'Ср кол-во клиентов на оператора', value: '4', delta: '-1', deltaPositive: false },
  { title: 'Утилизация операторов', value: '20%', delta: '-5.2%', deltaPositive: false },
];

const KPI_CATEGORY_COPY: Record<KpiCategoryKey, KpiCategoryCopy> = {
  appeals: KPI_APPEALS_AND_ORDERS_COPY,
  orders: KPI_APPEALS_AND_ORDERS_COPY,
  revenue: {
    metricTitles: KPI_REVENUE_METRIC_TITLES,
    chartTitleLeft: 'График доходов',
    chartTitleRight: 'Выручка за услуги',
    filledMetrics: KPI_REVENUE_METRICS_FILLED,
  },
  reviews: {
    metricTitles: KPI_REVIEWS_METRIC_TITLES,
    chartTitleLeft: 'Распределение оценок',
    chartTitleRight: 'Динамика рейтинга',
    filledMetrics: KPI_REVIEWS_METRICS_FILLED,
  },
  load: {
    metricTitles: KPI_LOAD_METRIC_TITLES,
    chartTitleLeft: 'Средняя загруженность сети',
    chartTitleRight: 'Клиенты по часам',
    filledMetrics: KPI_LOAD_METRICS_FILLED,
  },
  staff: {
    metricTitles: KPI_STAFF_METRIC_TITLES,
    chartTitleLeft: 'График показателей по дням',
    chartTitleRight: 'Пиковые часы (сред. знач.)',
    filledMetrics: KPI_STAFF_METRICS_FILLED,
  },
};

const KPI_CHART_Y_LABELS = ['140+', '110', '90', '60', '30', '0'] as const;
const KPI_CHART_X_DATES = [
  '23.03',
  '24.03',
  '25.03',
  '26.03',
  '27.03',
  '28.03',
  '29.03',
  '30.03',
  '31.03',
  '01.04',
  '02.04',
] as const;

const PAGE_BG_VECTOR_1 = 'https://www.figma.com/api/mcp/asset/a36fcf1d-5e60-44b9-8458-68fab18ac38c';
const PAGE_BG_VECTOR_2 = 'https://www.figma.com/api/mcp/asset/18ee75ae-8b0c-4101-930e-5e582694ac80';
const PAGE_BG_VECTOR_3 = 'https://www.figma.com/api/mcp/asset/2dc9b39b-51ee-4310-ab30-b4fe1403a107';
const PAGE_BG_VECTOR_4 = 'https://www.figma.com/api/mcp/asset/2ce92b4d-3d2d-45f6-80f3-ac4ea0b636b3';
const KPI_BAR_HEIGHTS = [12, 34, 83, 130, 130, 176, 188, 222, 240, 254, 254, 254] as const;
const KPI_BAR_LABELS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
] as const;

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

const employeesAvatarPhoto1 =
  'https://www.figma.com/api/mcp/asset/915922bb-5f72-425e-8f6a-22f805749977';
const employeesAvatarPhoto2 =
  'https://www.figma.com/api/mcp/asset/93669ddf-4eda-4aff-8d2a-423de2bdd22d';

/** Модель строки для будущего API списка сотрудников */
export interface EmployeeListItem {
  id: string;
  fullName: string;
  role: string;
  /** null — плейсхолдер-аватар; иначе URL с бэка */
  avatarUrl: string | null;
}

const EMPLOYEE_FILTER_OPTIONS = [{ value: 'all', label: 'Все' }];

/** До подключения ручек: смените значение на `'filled'`, чтобы увидеть список. */
const EMPLOYEES_UI_STATE = 'empty' as 'empty' | 'filled';

const EMPLOYEES_MOCK: EmployeeListItem[] = [
  { id: '1', fullName: 'Иван Петров', role: 'Оператор', avatarUrl: null },
  { id: '2', fullName: 'Мария Сидорова', role: 'Менеджер', avatarUrl: employeesAvatarPhoto1 },
  { id: '3', fullName: 'Петр Петров', role: 'Оператор', avatarUrl: null },
  { id: '4', fullName: 'Алексеей Воронин', role: 'Оператор', avatarUrl: employeesAvatarPhoto2 },
  { id: '5', fullName: 'Ирина Михайлова', role: 'Оператор', avatarUrl: null },
  { id: '6', fullName: 'Ирина Михайлова', role: 'Оператор', avatarUrl: null },
];

const renderNoDataSvg = (isDark: boolean) => (
  <svg width="180" height="116" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg" aria-label="Нет данных">
    <title>Нет данных</title>
    <g transform="translate(0 1)" fill="none" fillRule="evenodd">
      <ellipse fill={isDark ? 'transparent' : '#F5F5F5'} cx="32" cy="33" rx="32" ry="7" />
      <g fillRule="nonzero" stroke={isDark ? '#F9FAFB' : '#8FA3B5'} strokeWidth="1.8">
        <path
          d={
            isDark
              ? 'M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761'
              : 'M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z'
          }
        />
        <path
          d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
          fill={isDark ? 'transparent' : '#FAFAFA'}
        />
      </g>
    </g>
  </svg>
);

/** Все варианты блока «Подписки» (Figma 1:5837); на экране — только `SUBSCRIPTIONS_DISPLAY_STATE`. */
export type SubscriptionsDisplayState =
  | 'overviewGrayEmpty'
  | 'overviewHasData'
  | 'overviewNoNotifications'
  | 'overviewNoBusinessPoints'
  | 'historyHasRows'
  | 'historySinglePayment'
  | 'historyEmpty';

const SUBSCRIPTIONS_DISPLAY_STATE: SubscriptionsDisplayState = 'overviewGrayEmpty';

/** Иконки счётчиков «Подписки» — экспорт из Figma (node 1:6066), при проде вынести в /public */
const SUBSCRIPTIONS_ICON_TOTAL =
  'https://www.figma.com/api/mcp/asset/6e08e836-4a98-4f9a-b897-519c5bacfc02';
const SUBSCRIPTIONS_ICON_ACTIVE =
  'https://www.figma.com/api/mcp/asset/1ed7de8a-cdf7-4f6f-9880-73209f4b0746';
const SUBSCRIPTIONS_ICON_INACTIVE =
  'https://www.figma.com/api/mcp/asset/1f777a74-04d4-4281-933a-a9f450cd2ed8';

/** Пустое состояние «История платежей» — Figma node 1:5913 / 1:5837 */
const SUBSCRIPTIONS_HISTORY_EMPTY_IMG =
  'https://www.figma.com/api/mcp/asset/9638eebb-4903-4531-af3e-26e17bb50270';

function renderSubscriptionsOverviewContent(state: SubscriptionsDisplayState): React.ReactNode {
  switch (state) {
    case 'overviewGrayEmpty':
      return (
        <div className={styles.subscriptionsOverviewMuted}>
          <div className={styles.subscriptionsStatsRow}>
            <div className={styles.subscriptionStatCard}>
              <div className={styles.subscriptionStatIcon}>
                <img
                  src={SUBSCRIPTIONS_ICON_TOTAL}
                  alt=""
                  width={54}
                  height={54}
                  className={styles.subscriptionStatIconImg}
                />
              </div>
              <div className={styles.subscriptionStatText}>
                <p className={styles.subscriptionStatLabel}>Всего</p>
                <p className={styles.subscriptionStatValue}>0</p>
              </div>
            </div>
            <div className={styles.subscriptionStatCard}>
              <div className={styles.subscriptionStatIcon}>
                <img
                  src={SUBSCRIPTIONS_ICON_ACTIVE}
                  alt=""
                  width={54}
                  height={54}
                  className={styles.subscriptionStatIconImg}
                />
              </div>
              <div className={styles.subscriptionStatText}>
                <p className={styles.subscriptionStatLabel}>Активные</p>
                <p className={styles.subscriptionStatValue}>0</p>
              </div>
            </div>
            <div className={styles.subscriptionStatCard}>
              <div className={styles.subscriptionStatIcon}>
                <img
                  src={SUBSCRIPTIONS_ICON_INACTIVE}
                  alt=""
                  width={54}
                  height={54}
                  className={styles.subscriptionStatIconImg}
                />
              </div>
              <div className={styles.subscriptionStatText}>
                <p className={styles.subscriptionStatLabel}>Не активные</p>
                <p className={styles.subscriptionStatValue}>0</p>
              </div>
            </div>
          </div>
        </div>
      );
    case 'overviewHasData':
      return (
        <div className={styles.subscriptionsStateStub}>
          Обзор с данными: предупреждение о продлении, счётчики, способ оплаты, итого — подключение к API (макет Figma,
          ветка «есть данные»).
        </div>
      );
    case 'overviewNoNotifications':
      return (
        <div className={styles.subscriptionsStateStub}>
          Обзор «нет уведомлений»: блок активации подписки — под API.
        </div>
      );
    case 'overviewNoBusinessPoints':
      return (
        <div className={styles.subscriptionsStateStub}>
          Обзор «нет БТ»: призыв добавить бизнес-точку — под API.
        </div>
      );
    case 'historyHasRows':
    case 'historySinglePayment':
    case 'historyEmpty':
      return (
        <div className={styles.subscriptionsStateStub}>
          Контент вкладки «Обзор» для выбранного состояния истории не задан — переключите таб программно после
          подключения API.
        </div>
      );
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}

/** Контент вкладки «История платежей» (по `SUBSCRIPTIONS_DISPLAY_STATE` после API). */
function renderSubscriptionsHistoryTabContent(state: SubscriptionsDisplayState): React.ReactNode {
  switch (state) {
    case 'historyHasRows':
      return (
        <div className={styles.subscriptionsStateStub}>
          Таблица: дата, описание, сумма, статус (Tag), кнопка «Показать ещё» — под API.
        </div>
      );
    case 'historySinglePayment':
      return (
        <div className={styles.subscriptionsStateStub}>
          Одна строка платежа + заголовки колонок — под API.
        </div>
      );
    case 'historyEmpty':
    case 'overviewGrayEmpty':
    case 'overviewHasData':
    case 'overviewNoNotifications':
    case 'overviewNoBusinessPoints':
      return (
        <div className={styles.subscriptionsHistoryEmptyWrap}>
          <div className={styles.subscriptionsHistoryEmptyInner}>
            <img
              src={SUBSCRIPTIONS_HISTORY_EMPTY_IMG}
              alt=""
              width={80}
              height={60}
              className={styles.subscriptionsHistoryEmptyImg}
            />
            <p className={styles.subscriptionsHistoryEmptyText}>Нет данных</p>
          </div>
        </div>
      );
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}

const SubscriptionsSection: React.FC = () => {
  const [subscriptionTab, setSubscriptionTab] = useState<'overview' | 'history'>('overview');

  return (
    <article className={`${styles.smallCard} ${styles.subscriptionsCard}`}>
      <div className={styles.subscriptionsHeader}>
        <h3 className={styles.subscriptionsTitle}>Подписки</h3>
        <span className={styles.subscriptionsManageText}>Управление подписками</span>
      </div>
      <Tabs
        className={styles.subscriptionsTabsBar}
        activeKey={subscriptionTab}
        onChange={(key) => setSubscriptionTab(key as 'overview' | 'history')}
        tabBarGutter={30}
        items={[
          { key: 'overview', label: 'Обзор' },
          { key: 'history', label: 'История платежей' },
        ]}
      />
      <div className={styles.subscriptionsTabBody}>
        {subscriptionTab === 'overview'
          ? renderSubscriptionsOverviewContent(SUBSCRIPTIONS_DISPLAY_STATE)
          : renderSubscriptionsHistoryTabContent(SUBSCRIPTIONS_DISPLAY_STATE)}
      </div>
    </article>
  );
};

const KPI_DATE_PICKER_POPUP_CLASS = 'kpiAppealsDatePickerDropdown';

export const BusinessPointsPage: React.FC = () => {
  const theme = useThemeStore((s) => s.theme);
  const noDataSvg = renderNoDataSvg(theme === 'dark');
  const monitoringCards = monitoringCardsByState[pageState];
  const isConnected = pageState !== 'no-company';
  const lastActionState = lastActionStateByPageState[pageState];
  const activeShiftsState = activeShiftsStateByPageState[pageState];
  const [shiftTab, setShiftTab] = useState<'active' | 'break'>('active');
  const [employeeFilter, setEmployeeFilter] = useState<string>('all');
  const [kpiCategoryTab, setKpiCategoryTab] = useState<
    'appeals' | 'orders' | 'revenue' | 'reviews' | 'load' | 'staff'
  >('appeals');
  const currentShiftRows = shiftTab === 'active' ? activeShiftsRows : breakShiftsRows;
  const hasKpiTabData = KPI_TAB_UI_STATE === 'hasData';
  const kpiCopy = KPI_CATEGORY_COPY[kpiCategoryTab];

  const employeesFromApi: EmployeeListItem[] | null =
    EMPLOYEES_UI_STATE === 'filled' ? EMPLOYEES_MOCK : null;
  const hasEmployees = Boolean(employeesFromApi?.length);
  const renderAddBusinessPointButton = (disabled: boolean) => (
    <button type="button" disabled={disabled} className={`${styles.addBusinessPointBtn} ${disabled ? styles.addBusinessPointBtnDisabled : ''}`}>
      <span className={styles.addBusinessPointPlus}>+</span> Добавить бизнес-точку
    </button>
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageVectors} aria-hidden="true">
        <img src={PAGE_BG_VECTOR_1} alt="" className={`${styles.pageVector} ${styles.pageVectorOne}`} />
        <img src={PAGE_BG_VECTOR_2} alt="" className={`${styles.pageVector} ${styles.pageVectorTwo}`} />
        <img src={PAGE_BG_VECTOR_3} alt="" className={`${styles.pageVector} ${styles.pageVectorThree}`} />
        <img src={PAGE_BG_VECTOR_4} alt="" className={`${styles.pageVector} ${styles.pageVectorFour}`} />
      </div>

      <div className={styles.pageContent}>
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
          <section className={`${styles.card} ${styles.liveMonitoringSection}`}>
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

        <div className={`${styles.twoColumns} ${styles.employeesSection}`}>
          <article className={`${styles.smallCard} ${styles.employeesCard}`}>
            <div className={styles.employeesHeader}>
              <h3 className={styles.employeesTitle}>Сотрудники</h3>
              <div className={styles.employeesHeaderFilter}>
                <span>{hasEmployees ? 'Роль' : 'Статус'}</span>
                <Select
                  value={employeeFilter}
                  onChange={setEmployeeFilter}
                  options={EMPLOYEE_FILTER_OPTIONS}
                  className={styles.employeesSelect}
                  popupClassName="bp-filter-dropdown"
                  aria-label={hasEmployees ? 'Фильтр по роли' : 'Фильтр по статусу'}
                />
              </div>
            </div>

            {!hasEmployees ? (
              <>
                <div className={styles.panelEmptyWrap}>
                  <Empty className={styles.noDataEmpty} description="Нет данных" image={noDataSvg} />
                </div>
                <div className={styles.employeesFooter}>
                  <Button
                    type="link"
                    disabled
                    className={`${styles.employeesFooterLink} ${styles.employeesFooterLinkStatic}`}
                  >
                    Добавить сотрудника
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.employeesListHead}>
                  <span>Сотрудник</span>
                  <span>Роль</span>
                </div>
                <div className={styles.employeesListScroll}>
                  <List
                    className={styles.employeesList}
                    dataSource={employeesFromApi ?? []}
                    renderItem={(item) => (
                      <List.Item className={styles.employeesListItem} key={item.id}>
                        <div className={styles.employeesRow}>
                          <div className={styles.employeesRowMain}>
                            {item.avatarUrl ? (
                              <Avatar src={item.avatarUrl} size={30} className={styles.employeesAvatar} />
                            ) : (
                              <Avatar size={30} icon={<UserOutlined />} className={styles.employeesAvatarPlaceholder} />
                            )}
                            <span className={styles.employeesName}>{item.fullName}</span>
                          </div>
                          <span className={styles.employeesRole}>{item.role}</span>
                        </div>
                      </List.Item>
                    )}
                  />
                </div>
                <div className={`${styles.employeesFooter} ${styles.employeesFooterSplit}`}>
                  <Button
                    type="link"
                    disabled
                    className={`${styles.employeesFooterLink} ${styles.employeesFooterLinkStatic}`}
                  >
                    Добавить сотрудника
                  </Button>
                  <Button type="link" className={styles.employeesFooterLink}>
                    Все сотрудники
                  </Button>
                </div>
              </>
            )}
          </article>

          <SubscriptionsSection />
        </div>

          <section className={`${styles.card} ${styles.kpiSection}`}>
          <div className={`${styles.kpiTopToolbar} ${!hasKpiTabData ? styles.kpiTopToolbarMuted : ''}`}>
            <div className={styles.kpiToolbarFilters}>
              <div className={styles.kpiFilterGroup}>
                <span>Бизнес-точка</span>
                <Select
                  defaultValue="maksi"
                  options={[{ value: 'maksi', label: 'Шиномонтаж "Макси"' }]}
                  className={styles.kpiToolbarSelect}
                  popupClassName="bp-filter-dropdown"
                  suffixIcon={
                    <img
                      src={KPI_FIGMA_ASSETS.chevron}
                      alt=""
                      width={8}
                      height={14}
                      className={styles.kpiSelectChevron}
                    />
                  }
                />
              </div>
              <div className={styles.kpiFilterGroup}>
                <span>Дата:</span>
                <DatePicker
                  defaultValue={dayjs('2025-10-10')}
                  format="DD.MM.YYYY"
                  allowClear={false}
                  variant="outlined"
                  placement="bottomLeft"
                  className={styles.kpiDatePicker}
                  popupClassName={KPI_DATE_PICKER_POPUP_CLASS}
                  rootClassName={styles.kpiDatePickerRoot}
                  prefix={
                    <img
                      src={KPI_FIGMA_ASSETS.calendar}
                      alt=""
                      width={20}
                      height={20}
                      className={styles.kpiDatePickerPrefixIcon}
                    />
                  }
                />
              </div>
              <div className={styles.kpiFilterGroup}>
                <span>Сравнивать с:</span>
                <Select
                  defaultValue="yesterday"
                  options={[{ value: 'yesterday', label: 'Вчера' }]}
                  className={styles.kpiToolbarSelectCompare}
                  popupClassName="bp-filter-dropdown"
                  suffixIcon={
                    <img
                      src={KPI_FIGMA_ASSETS.chevron}
                      alt=""
                      width={8}
                      height={14}
                      className={styles.kpiSelectChevron}
                    />
                  }
                />
              </div>
            </div>
            <div className={styles.kpiToolbarActions}>
              <span className={styles.kpiToolbarAction}>
                <img src={KPI_FIGMA_ASSETS.refresh} alt="" width={24} height={24} />
                Обновить
              </span>
              <span className={styles.kpiToolbarActionPrimary}>
                <img src={KPI_FIGMA_ASSETS.upload} alt="" width={24} height={24} className={styles.kpiUploadIcon} />
                Полная статистика
              </span>
            </div>
          </div>

          <div className={styles.kpiTitleRow}>
            <h2 className={styles.kpiMainTitle}>KPI-панель</h2>
            <Tabs
              className={styles.kpiCategoryTabsBar}
              activeKey={kpiCategoryTab}
              onChange={(key) =>
                setKpiCategoryTab(key as 'appeals' | 'orders' | 'revenue' | 'reviews' | 'load' | 'staff')
              }
              tabBarGutter={20}
              items={[
                { key: 'appeals', label: 'Обращения' },
                { key: 'orders', label: 'Заказы' },
                { key: 'revenue', label: 'Доходы' },
                { key: 'reviews', label: 'Отзывы и качество' },
                { key: 'load', label: 'Загруженность' },
                { key: 'staff', label: 'Персонал' },
              ]}
            />
          </div>

          <>
            <div className={`${styles.kpiAppealsMetricsRow} ${hasKpiTabData ? styles.kpiAppealsMetricsRowFilled : ''}`}>
              {hasKpiTabData
                ? kpiCopy.filledMetrics.map((m) => (
                    <article key={m.title} className={`${styles.kpiMetricCard} ${styles.kpiMetricCardFilled}`}>
                      <p className={styles.kpiMetricTitle}>{m.title}</p>
                      <div className={styles.kpiMetricValueRow}>
                        <span className={styles.kpiMetricValue}>{m.value}</span>
                        <span
                          className={m.deltaPositive ? styles.kpiMetricDeltaPositive : styles.kpiMetricDeltaNegative}
                        >
                          {m.delta}
                        </span>
                      </div>
                    </article>
                  ))
                : kpiCopy.metricTitles.map((title) => (
                    <article
                      key={`${kpiCategoryTab}-${title}`}
                      className={`${styles.kpiMetricCard} ${styles.kpiMetricCardEmpty}`}
                    >
                      <p className={styles.kpiMetricTitle}>{title}</p>
                      <div className={styles.kpiMetricEmptyZone}>
                        <div className={styles.kpiMetricEmptyGrid}>
                          <img
                            src={KPI_FIGMA_ASSETS.emptyMetric}
                            alt=""
                            width={50}
                            height={38}
                            className={styles.kpiMetricEmptyImg}
                          />
                          <span className={styles.kpiMetricEmptyLabel}>Нет данных</span>
                        </div>
                      </div>
                    </article>
                  ))}
            </div>

            <div className={styles.kpiChartsRow}>
              <article
                className={`${styles.kpiChartPanel} ${hasKpiTabData ? styles.kpiChartPanelFilled : styles.kpiChartPanelEmpty}`}
              >
                <h3 className={styles.kpiChartTitle}>{kpiCopy.chartTitleLeft}</h3>
                {hasKpiTabData ? (
                  <div className={styles.kpiAreaChartWrap}>
                    <div className={styles.kpiChartYAxis}>
                      {KPI_CHART_Y_LABELS.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                    <div className={styles.kpiAreaChartPlot}>
                      <img src={KPI_FIGMA_ASSETS.areaChart} alt="" className={styles.kpiAreaChartImg} />
                      <div className={styles.kpiChartXAxisDates}>
                        {KPI_CHART_X_DATES.map((d) => (
                          <span key={d}>{d}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.kpiChartEmpty}>
                    <div className={styles.kpiChartEmptyColumn}>
                      <img src={KPI_FIGMA_ASSETS.emptyChart} alt="" width={93} height={70} />
                      <p className={styles.kpiChartEmptyCaption}>Нет данных</p>
                    </div>
                  </div>
                )}
              </article>

              <article
                className={`${styles.kpiChartPanel} ${hasKpiTabData ? styles.kpiChartPanelFilled : styles.kpiChartPanelEmpty}`}
              >
                <h3 className={styles.kpiChartTitle}>{kpiCopy.chartTitleRight}</h3>
                {hasKpiTabData ? (
                  <div className={styles.kpiBarChartWrap}>
                    <div className={styles.kpiChartYAxis}>
                      {KPI_CHART_Y_LABELS.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                    <div className={styles.kpiBarChartPlot}>
                      <div className={styles.kpiBarsTrack}>
                        {KPI_BAR_HEIGHTS.slice(0, KPI_BAR_LABELS.length).map((h, i) => (
                          <div
                            key={`kpi-bar-${kpiCategoryTab}-${i}`}
                            className={styles.kpiBar}
                            style={{ height: `${Math.round((h / 254) * 234)}px` }}
                          />
                        ))}
                      </div>
                      <div className={styles.kpiChartXAxisTimes}>
                        {KPI_BAR_LABELS.map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.kpiChartEmpty}>
                    <div className={styles.kpiChartEmptyColumn}>
                      <img src={KPI_FIGMA_ASSETS.emptyChart} alt="" width={93} height={70} />
                      <p className={styles.kpiChartEmptyCaption}>Нет данных</p>
                    </div>
                  </div>
                )}
              </article>
            </div>
          </>
          </section>
        </main>
      </div>
    </div>
  );
};
