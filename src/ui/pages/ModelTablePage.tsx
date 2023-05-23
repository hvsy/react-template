import {ReactNode, useImperativeHandle, useMemo,} from "react";
import {Searchable, useSearchable} from "@/hooks/useSearchable";
import {LaravelTable, LaravelTableOptions, useLaravelTable} from "@/hooks/useLaravelTable";
import {Button, Table, TableProps, Tooltip} from "antd";
import {TableHeader} from "@/ui/fragments/TableHeader";
import {useModelDialog, UseModelDialogOptions} from "@/ui/fragments/ModelDialog";
import {TableSearchForm} from "@/ui/fragments/TableSearchForm";
import {useTableSelected} from "@/hooks/useTableSelected";
import {ModelDialogActions} from "@/ui/hooks/useModelDialogActions";
import {PlusOutlined, QuestionCircleFilled, ReloadOutlined} from "@ant-design/icons";
import React from "react";
import useSWR from "swr";
import qs from "qs";
import {PageBlock} from "@/ui/pages/PageBlock";
import {PageContainer} from "@/ui/pages/PageContainer";
import {useUser} from "@/containers/AuthContainer";
import {LaravelModelCallback} from "../../hooks/useLaravelModel";
import {useLaravelSearchable} from "../../hooks/useLaravelSearchable";
import {useLocation} from "react-router-dom";

export type ModelTablePageProps = {
    url: string;
    initialValues?: any;
    columns: (dlg: ModelDialogActions & {delete : (id : string|number)=>Promise<any>},getTable : ()=>LaravelTable,searchable : Searchable) => TableProps<any>['columns'];
    label: string;
    formComponent?: ReactComponent<any>;
    searchForm?: ReactNode;
    searchExtra?:ReactNode;
    children ?: ReactNode;
    renderHeaderExtra ?:(searchable : Searchable)=>ReactNode;
    renderHeaderActions ?: (table : any, searchable : Searchable)=>ReactNode;
    dialogOptions ?: UseModelDialogOptions &{modelCallback ?: LaravelModelCallback} & any;
    renderBatchActions ?: (selected : React.Key[], table : any, searchable : Searchable)=>ReactNode;
    showCreateButton ?: boolean;
    showHeader ?: boolean;
    tableOptions ?: Omit<LaravelTableOptions<any>,"columns"|'summary'> & {
        summary ?: (pageData : readonly any[],summary ?: any)=> ReactNode;
    },
    tableClassName ?: string;
    modelUrl ?: string;
    summaryUrl ?: string;
    searchableType ?: 'memory'|'url';
    className ?: string;
    selectedMode ?: 'key'|'all',
    disableCreateButton ?: boolean;
    createButtonTip ?: ReactNode;
};



export const ModelTablePageInner  = React.forwardRef<{
    getTable : ()=>any;
},ModelTablePageProps>((props,ref) => {
    const {url, searchForm,searchExtra,children,
        label, initialValues = {}, columns, formComponent,
        selectedMode = 'key',
        showHeader = true,
        renderHeaderActions,
        dialogOptions,
        renderBatchActions,
        showCreateButton = true,
        tableOptions = {},
        tableClassName = '',
        modelUrl = url,
        summaryUrl,
        searchableType = 'url',
        className,
        disableCreateButton = false,
        renderHeaderExtra,
        createButtonTip,
    } = props;

    const searchable  =useLaravelSearchable(url,searchableType,initialValues);
    const {data : summary,} = useSWR(summaryUrl? searchable.replace(summaryUrl) : null);
    const [handler, dlg] = useModelDialog(formComponent, modelUrl, {
        label,
        autoClose: true,
        afterSubmit() {
            table.refresh();
        },
        ...dialogOptions,
    });
    const laravelTable : LaravelTable = useLaravelTable(searchable, {
        columns: columns(dlg,()=>table,searchable)?.filter(Boolean),
        ...tableOptions,
        summary : (tableOptions?.summary ? (pageData) => {
            const summaryFunction = tableOptions!.summary!;
            return summaryFunction(pageData,summary);
        } :undefined)
    });
    const table = useMemo(()=>({
        ...laravelTable,
        refresh(){
            laravelTable?.refresh();
            rowSelection.onChange([],[]);
        }
    }),[laravelTable]);
    const [selected,rowSelection] = useTableSelected(selectedMode);
    useImperativeHandle(ref, () => {
        return {
            getTable(){
                return table;
            },
        }
    }, [rowSelection]);

    const query = searchable.search.toString();
    const values = qs.parse(query);
    const [user] = useUser();
    // @ts-ignore
    return (
        <PageContainer className={`m-4 flex-1 overflow-hidden flex flex-col ${className||''}`}>
            {(searchForm||searchExtra) && <div className={'bg-white flex flex-row'}>
                {searchForm && <TableSearchForm className="flex-1" key={query} onSubmit={async (values) => {
                    searchable.set({
                        ...values,
                        page : 1,
                    });
                }} initialValues={values} reset={() => {
                    searchable.setSearch(new URLSearchParams());
                }}>
                    {searchForm}
                </TableSearchForm>}
                {searchExtra ? searchExtra : null}
            </div>}
            {showHeader && <TableHeader title={`${label}列表`}>
                {renderHeaderExtra ?renderHeaderExtra(searchable) :null}
                {renderBatchActions ?renderBatchActions(selected,table,searchable) :null}
                {renderHeaderActions ?renderHeaderActions(table,searchable) : null}

                {showCreateButton && formComponent && <div className={'flex flex-row items-center space-x-2'}>
                    <Button disabled={disableCreateButton} onClick={dlg.create} type="primary" icon={<PlusOutlined />}>新增{label}</Button>
                    {createButtonTip}
                </div>}
                <Button onClick={table.refresh} type="primary" icon={<ReloadOutlined />}>
                    刷新
                </Button>
            </TableHeader>}
            <PageBlock>
                <Table scroll={{
                    x:true,
                    y : 'auto'
                }} {...table}
                      className={`smart-table ${tableClassName}`}
                       rowSelection={renderBatchActions ? rowSelection: undefined}/>
            </PageBlock>
            {handler}
            {children}
        </PageContainer>
    );
});

export const ModelTablePage = React.forwardRef<{
    getTable : ()=>any;
},ModelTablePageProps>((props,ref) => {
    const {searchableType = 'url',initialValues,...others} = props;
    const location = useLocation();
    return <ModelTablePageInner
                           ref={ref} {...others}
                           key={(searchableType === 'url' && !!initialValues) ? location.key : undefined}
                           searchableType={searchableType}
                           initialValues={initialValues}
    />;
});
