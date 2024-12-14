import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { List, ResultPage, ErrorBlock } from "antd-mobile";

interface IRes {
  code: number;
  data: IData;
  msg: string;
}
interface IData {
  batchName: string;
  companyName: string;
  isFirst: boolean;
  productName: string;
  usedSum: number;
  usedTime: string;
}

enum IStatus {
  "等待" = 0,
  "成功",
  "失败",
}
const uuid = new URL(window.location.href).searchParams.get("uuid");
function App() {
  const [detail, setDetail] =
    useState<{ label: string; value: string; bold?: boolean }[]>();
  const [status, setStatus] = useState<IStatus>(IStatus.等待);
  useEffect(() => {
    async function fetch() {
      try {
        const res: IRes = (await axios.get(`/api/code/${uuid}`)).data;

        if (res.code === 200) {
          setStatus(IStatus.成功);
          setDetail([
            { label: "品牌归属", value: res.data.companyName },
            { label: "产品名称", value: res.data.productName },
            { label: "批次名称", value: res.data.batchName },
            {
              label: "首次查询时间",
              value: res.data.isFirst ? "该码为首次查询" : res.data.usedTime,
            },
            {
              label: "查询次数",
              value: res.data.usedSum.toString(),
            },
          ]);
        }
      } catch (error) {
        setStatus(IStatus.失败);
      }
    }
    fetch();
  }, []);
  return (
    <ResultPage
      className="app-page"
      status={
        status === IStatus.等待
          ? "waiting"
          : status === IStatus.成功
          ? "success"
          : "error"
      }
      title={
        status === IStatus.等待
          ? "查询中"
          : status === IStatus.成功
          ? "查询成功"
          : "查询失败"
      }
      style={{ "--background-color": status === IStatus.失败 ? "#ff6600" : "" }}
      description={
        <div>
          防伪码：{uuid} <br />
        </div>
      }
    >
      {status === IStatus.成功 ? (
        <ResultPage.Card style={{ padding: "20px" }}>
          {detail &&
            detail?.map((item) => {
              return (
                <List>
                  <List.Item extra={item.value}>{item.label}</List.Item>
                </List>
              );
            })}
        </ResultPage.Card>
      ) : status === IStatus.失败 ? (
        <ErrorBlock
          title=""
          description=""
          style={{ marginTop: "50px" }}
          status="empty"
        ></ErrorBlock>
      ) : (
        ""
      )}
    </ResultPage>
  );
}

export default App;
