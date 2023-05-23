import {FC, useMemo} from "react";
import {Modal, ModalProps, Spin} from "antd";
import {useOkAndCancel} from "@/hooks/useOkAndCancel";

export type DialogProps<F extends any = any> = Omit<ModalProps, "onOk" | "onCancel" | "confirmLoading"|"footer"|'afterClose'> & {
    cancel?: Function;
    submit?: () => Promise<any> | void;
    submitting?: boolean;
    loading?: boolean;
    footer ?: React.ReactNode|ReactComponent<F>,
    afterSubmit ?: Function;
    afterCancel ?: Function;
    after ?: Function;
    autoClose ?: boolean;
    plain ?: boolean;
};


export const Dialog: FC<DialogProps> = (props) => {
    const {loading = false,
        submitting, children,
        plain  =false,
        className = '',
        footer : Footer, ...others} = props;
    let footer = undefined;
    if(Footer !== undefined){
        footer = typeof Footer === 'function' ?  <Footer {...others} /> : Footer;
    }
    const [onOk,onCancel] = useOkAndCancel(others);

    return <Modal
        className={`${className} ${plain ? 'plain-dialog' : ''}`}
        {...others}
        onOk={onOk}
        onCancel={onCancel}
        footer={footer}
        destroyOnClose={true}
        confirmLoading={submitting}
    >
        {loading ? <div className={'flex flex-col justify-center items-center'}>
            <Spin/>
        </div> : children}
    </Modal>
};
