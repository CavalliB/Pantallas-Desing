import * as React from "react";
import { Crud } from "@toolpad/core/Crud";
import { useParams } from "react-router";
import { buyOrdersDataSource, BuyOrder, buyOrderCache } from "../data/buyOrders";

export default function BuyOrdersCrudPage() {
    const { buyOrdersId } = useParams();

    return (
        <Crud<BuyOrder>
            dataSource={buyOrdersDataSource}
            dataSourceCache={buyOrderCache}
            rootPath="/buyOrders"
            initialPageSize={25}
            defaultValues={{ itemCount: 1 }}
            pageTitles={{
                show: `BuyOrders ${buyOrdersId}`,
                create: "New Supplies",
                edit: `BuyOrders ${buyOrdersId} - Edit`,
            }}
        />
    );
}
