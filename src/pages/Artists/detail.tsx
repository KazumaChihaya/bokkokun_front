import {
  Col,
  Descriptions,
  Row,
  Typography,
  Grid,
  DescriptionsProps,
  Card,
  Button,
  Table,
} from 'antd';

import React, { useState } from 'react';
import { UseQueryResult } from 'react-query';
import { useParams } from 'react-router-dom';
import { ArtistDetail, BoxInvoice, EarnInvoice } from '@/services/arrow-manage/artist';
import { antize } from '../../libs/icon';
import { MdOutlineDomain } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { FormOutlined } from '@ant-design/icons';
import { Artist, ActiveBox, ReserveBox, useArtist } from '@/services/arrow-manage/artist';
import { contact } from './util';
import type { ColumnsType, TableProps } from 'antd/lib/table';
import { Box } from '@/services/arrow-manage/box';
import { format } from 'date-fns';
import ArtistEdit from './components/ArtistEdit';
import ActiveBoxAdd from './components/ActiveBoxAdd';
import ActiveBoxDelete from './components/ActiveBoxDelete';
import ReserveBoxAdd from './components/ReserveBoxAdd';
import ActiveBoxResign from './components/ActiveBoxResign';
import ReserveBoxResign from './components/ReserveBoxResign';
import ActiveBoxEdit from './components/ActiveBoxEdit';
import ReserveBoxEdit from './components/ReserveBoxEdit';
import ReserveBoxDelete from './components/ReserveBoxDelete';

export type ArtistDetailProps = {
  artist: ArtistDetail;
};

const { Item } = Descriptions;
const { Title } = Typography;
const { useBreakpoint } = Grid;

const diffBox = (...props: (keyof Box)[]) => {
  return (box: Box, prev: Box) => {
    for (const prop of props) {
      if (box[prop] !== prev[prop]) return true;
    }
    return false;
  };
};
const diffActiveBox = (...props: (keyof ActiveBox)[]) => {
  return (active_box: ActiveBox, prev: ActiveBox) => {
    for (const prop of props) {
      if (active_box[prop] !== prev[prop]) return true;
    }
    return false;
  };
};
const diffReserveBox = (...props: (keyof ReserveBox)[]) => {
  return (reserve_box: ReserveBox, prev: ReserveBox) => {
    for (const prop of props) {
      if (reserve_box[prop] !== prev[prop]) return true;
    }
    return false;
  };
};
const diffEarnInvoice = (...props: (keyof EarnInvoice)[]) => {
  return (earn_invoice: EarnInvoice, prev: EarnInvoice) => {
    for (const prop of props) {
      if (earn_invoice[prop] !== prev[prop]) return true;
    }
    return false;
  };
};
const diffBoxInvoice = (...props: (keyof BoxInvoice)[]) => {
  return (box_invoice: BoxInvoice, prev: BoxInvoice) => {
    for (const prop of props) {
      if (box_invoice[prop] !== prev[prop]) return true;
    }
    return false;
  };
};

const boxColumns: ColumnsType<Box> = [
  {
    title: '?????????',
    key: 'boxcode',
    render: (_, { box_category, id }) => (
      <div style={{ minWidth: '8em' }}>
        <Link to={`/boxes/${id}`}>{box_category.code+id}</Link>
      </div>
    ),
    shouldCellUpdate: diffBox('box_category'),
  },
  {
    title: '???????????????',
    dataIndex: 'status',
    width: '12em',
    shouldCellUpdate: diffBox('status'),
  },
  {
    title: '?????????',
    key: 'money',
    width: '12em',
    render: (_, { status, money, special_money }) => (
      <span>{status === '?????????' ? '' : (special_money ? '??'+special_money.toLocaleString() : money.toLocaleString())}</span>
    ),
    shouldCellUpdate: diffBox('money') || diffBox('special_money'),
  },
  {
    title: '???????????????',
    key: 'button',
    width: '12em',
    render: (_, box) => (
      box.status == '?????????' ?
      (
        box.reserve_box?.ended_on === null ?
        <ReserveBoxResign box={box}/> :
        <span>{format(new Date(box.reserve_box?.ended_on ?? '0000-00-00'), 'yyyy???MM???dd???')}</span>
      ) :
      (
        box.status == '???????????????' ?
        (
          box.active_box?.ended_on === null ?
          <ActiveBoxResign box={box}/> :
          <span>{format(new Date(box.active_box?.ended_on ?? '0000-00-00'), 'yyyy???MM???dd???')}</span>
        ) :
        <span></span>
      )
    ),
  },
];


const activeBoxColumns: ColumnsType<ActiveBox> = [
  {
    title: '?????????',
    key: 'boxcode',
    render: (_, { box, id }) => (
      <div style={{ minWidth: '8em' }}>
        <Link to={`/boxes/${box?.id}`}>{(box ? box?.box_category?.code : '')+box?.id}</Link>
      </div>
    ),
    shouldCellUpdate: diffActiveBox('id'),
  },
  {
    title: '???????????????',
    key: 'started_on',
    render: (_, { started_on, id }) => (
      <span>{started_on ? format(new Date(started_on), 'yyyy???MM???dd???') : ''}</span>
    ),
    width: '10em',
    shouldCellUpdate: diffActiveBox('started_on'),
  },
  {
    title: '???????????????',
    key: 'ended_on',
    render: (_, { ended_on, id }) => (
      <span>{ended_on ? format(new Date(ended_on), 'yyyy???MM???dd???') : ''}</span>
    ),
    width: '10em',
    shouldCellUpdate: diffActiveBox('ended_on'),
  },
  {
    title: '?????????',
    key: 'money',
    render: (_, { money, id }) => (
      <span>{money ? '??'+money.toLocaleString() : ''}</span>
    ),
    width: '10em',
  },
  {
    title: '??????',
    key: 'button',
    width: '12em',
    render: (_, active_box) => (
      <>
        <ActiveBoxEdit key={"edit_active_box_"+active_box.id} active_box={active_box}/>
        <ActiveBoxDelete key={"delete_active_box_"+active_box.id}  active_box={active_box}/>
      </>
    ),
  },
];

const reserveBoxColumns: ColumnsType<ReserveBox> = [
  {
    title: '?????????',
    key: 'boxcode',
    render: (_, { box, id }) => (
      <div style={{ minWidth: '8em' }}>
        <Link to={`/boxes/${box?.id}`}>{(box ? box?.box_category?.code : '')+box?.id}</Link>
      </div>
    ),
    shouldCellUpdate: diffReserveBox('id'),
  },
  {
    title: '???????????????',
    key: 'started_on',
    render: (_, { started_on, id }) => (
      <span>{started_on ? format(new Date(started_on), 'yyyy???MM???dd???') : ''}</span>
    ),
    width: '10em',
    shouldCellUpdate: diffReserveBox('started_on'),
  },
  {
    title: '???????????????',
    key: 'ended_on',
    render: (_, { ended_on, id }) => (
      <span>{ended_on ? format(new Date(ended_on), 'yyyy???MM???dd???') : ''}</span>
    ),
    width: '10em',
    shouldCellUpdate: diffReserveBox('ended_on'),
  },
  {
    title: '??????',
    key: 'button',
    width: '12em',
    render: (_, reserve_box) => (
      <>
        <ReserveBoxEdit key={"edit_reserve_box_"+reserve_box.id} reserve_box={reserve_box}/>
        <ReserveBoxDelete key={"delete_reserve_box_"+reserve_box.id}  reserve_box={reserve_box}/>
      </>
    ),
  },
];


const boxInvoiceColumns: ColumnsType<BoxInvoice> = [
  {
    title: '??????',
    key: 'yermonth',
    render: (_, { yearmonth, id }) => (
      <span>{format(new Date(yearmonth+'-01'), 'yyyy???MM???')}</span>
    ),
    shouldCellUpdate: diffBoxInvoice('yearmonth'),
  },
  {
    title: '??????',
    key: 'money',
    render: (_, { each_box_invoice, id }) => (
      <span>{each_box_invoice ? '??'+each_box_invoice?.money.toLocaleString() : '???????????????'}</span>
    ),
    width: '10em',
    shouldCellUpdate: diffBoxInvoice('each_box_invoice'),
  },
  {
    title: '??????',
    key: 'ended_on',
    render: (_, { each_box_invoice, id }) => (
      <span>{each_box_invoice ? (each_box_invoice?.status ? '???' : '???') : ''}</span>
    ),
    width: '10em',
    shouldCellUpdate: diffBoxInvoice('each_box_invoice'),
  },
];

const earnInvoiceColumns: ColumnsType<EarnInvoice> = [
  {
    title: '??????',
    key: 'yermonth',
    render: (_, { yearmonth, id }) => (
      <span>{format(new Date(yearmonth+'-01'), 'yyyy???MM???')}</span>
    ),
    shouldCellUpdate: diffEarnInvoice('yearmonth'),
  },
  {
    title: '??????',
    key: 'money',
    render: (_, { each_earn_invoice, id }) => (
      <span>{each_earn_invoice ? '??'+each_earn_invoice?.money.toLocaleString() : '???????????????'}</span>
    ),
    width: '10em',
    shouldCellUpdate: diffEarnInvoice('each_earn_invoice'),
  },
  {
    title: '??????',
    key: 'ended_on',
    render: (_, { each_earn_invoice, id }) => (
      <span>{each_earn_invoice ? (each_earn_invoice?.status ? '???' : '???') : ''}</span>
    ),
    width: '10em',
    shouldCellUpdate: diffEarnInvoice('each_earn_invoice'),
  },
];

const CompanyDetailPage: React.FC<ArtistDetailProps> = ({}) => {
  const { id } = useParams();
  const { data: data } =
    useArtist(Number(id)) as UseQueryResult<{artist: Artist, boxes: Box[], active_boxes: ActiveBox[], reserve_boxes: ReserveBox[], box_invoices: BoxInvoice[], earn_invoices: EarnInvoice[]}>;
  const artist = data?.artist;
  const boxes = data?.boxes;
  const active_boxes = data?.active_boxes;
  const reserve_boxes = data?.reserve_boxes;
  const box_invoices = data?.box_invoices;
  const earn_invoices = data?.earn_invoices;

  const bp = useBreakpoint();

  const MyDescriptions: React.FC<DescriptionsProps> = (props) => (
    <Descriptions
      size="small"
      labelStyle={{ width: '13em' }}
      bordered
      column={{ sm: 1, xs: 1, md: 1 }}
      layout={!bp.md ? 'vertical' : 'horizontal'}
      {...props}
    />
  );

  return artist ? (
    <>
      <div style={{ paddingLeft: '0.1rem' }}>
        <Title
          level={4}
          style={{ marginBottom: '0' }}
        >{`${artist.name}`}</Title>
        <div style={{ color: 'GrayText' }}>{artist.code}</div>
      </div>
      <Row style={{ marginTop: '15px' }}>
        <Col
          xxl={12}
          xl={12}
          lg={12}
          span={12}
          style={{ paddingRight: '10px' }}
        >
          <Card title={<>{antize(MdOutlineDomain)} ????????????????????? <ArtistEdit artist={artist}/></>}>
            <MyDescriptions>
              <Item label="?????????">{artist.name}</Item>
              <Item label="????????????">{artist.code}</Item>
              <Item label="?????????????????????">{artist.mail}</Item>
              <Item label="twitter">@{artist.twitter}</Item>
              <Item label="instagram">{artist.instagram}</Item>
              <Item label="????????????">{contact[artist.contact]}</Item>
              <Item label="?????????%">{artist.rate}%</Item>
            </MyDescriptions>
          </Card>
        </Col>
        <Col
          xxl={12}
          xl={12}
          lg={12}
          span={12}
          style={{ paddingLeft: '10px' }}
        >
          <Card
            title={
              <>
                <FormOutlined style={{ marginRight: '0.3em' }} />
                ?????????????????????????????????
                <ActiveBoxAdd artist={artist}/> 
                <ReserveBoxAdd artist={artist}/>
              </>
            }
          >
            <Table
              scroll={{ x: true }}
              dataSource={boxes}
              columns={boxColumns}
              size="small"
              pagination={false}
            />
          </Card>

          <Card
            title={
              <>
                <FormOutlined style={{ marginRight: '0.3em' }} />
                ??????????????????
              </>
            }
          >
            <Table
              scroll={{ x: true }}
              dataSource={active_boxes}
              columns={activeBoxColumns}
              size="small"
              pagination={false}
            />
          </Card>

          <Card
            title={
              <>
                <FormOutlined style={{ marginRight: '0.3em' }} />
                ??????????????????
              </>
            }
          >
            <Table
              scroll={{ x: true }}
              dataSource={reserve_boxes}
              columns={reserveBoxColumns}
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col
          xxl={12}
          xl={12}
          lg={12}
          span={12}
          style={{ paddingRight: '10px' }}
        >
          <Card
            title={
              <>
                <FormOutlined style={{ marginRight: '0.3em' }} />
                ????????????
              </>
            }
          >
            <Table
              scroll={{ x: true }}
              dataSource={box_invoices}
              columns={boxInvoiceColumns}
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
        <Col
          xxl={12}
          xl={12}
          lg={12}
          span={12}
          style={{ paddingLeft: '10px' }}
        >
          <Card
            title={
              <>
                <FormOutlined style={{ marginRight: '0.3em' }} />
                ????????????
              </>
            }
          >
            <Table
              scroll={{ x: true }}
              dataSource={earn_invoices}
              columns={earnInvoiceColumns}
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </>
  ) : (
    <></>
  );
};

export default CompanyDetailPage;
