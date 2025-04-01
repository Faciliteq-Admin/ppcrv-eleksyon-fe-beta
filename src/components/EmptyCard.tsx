export default function EmptyCard(props: any) {

    return (
        <div className="mt-4 p-4 border shadow rounded" style={props.style}>
            {props.children}
        </div>
    );
}