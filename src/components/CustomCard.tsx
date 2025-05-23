export default function CustomCard(props: any) {

    return (
        <div className="flex flex-col rounded-2xl w-[500px] bg-[#ffffff] shadow-xl">
            <figure className="flex justify-center items-center rounded-2xl">
                <img src="https://tailwind-generator.b-cdn.net/images/card-generator/tailwind-card-generator-card-preview.png" alt="Card Preview" className="rounded-t-2xl" />
            </figure>
            <div className="flex flex-col p-8">
                <div className="text-2xl font-bold  text-center text-[#374151] pb-6">Generator</div>
                <div className=" text-lg  text-center text-[#374151]">Leverage a graphical editor to create, design and customize beautiful web components.</div>
                <div className="flex justify-end pt-6">
                    <button className="bg-[#7e22ce] text-[#ffffff] w-full font-bold text-base  p-3 rounded-lg hover:bg-purple-800 active:scale-95 transition-transform transform">Try it out!</button>
                </div>
            </div>
        </div>
    );
}