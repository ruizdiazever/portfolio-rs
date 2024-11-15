use crate::components::blog::post::Post;
use crate::components::common::modal::InfoModal;
use crate::components::common::values::Link;
use crate::layouts::layout::Layout;
use crate::utils::config::get_post_by_id;
use icondata as i;
use leptos::*;
use leptos_icons::*;
use uuid::{uuid, Uuid};

#[component]
pub fn Ms() -> impl IntoView {
    const ID: Uuid = uuid!("aa614ca5-0940-41a1-bf80-710096df26ac");
    let post_resource = create_resource(|| (), move |_| async move { get_post_by_id(ID) });

    let thats = r#"That's"#;
    let wasnt = r#"wasn's"#;

    let (show_description, _set_show_description) = create_signal(false);
    let (description, _set_description) = create_signal("".to_string());

    view! {
        <Layout>
            <Suspense fallback=|| view! { <p>"Loading..."</p> }>
                {move || {
                    post_resource
                        .get()
                        .map(|post| match post {
                            Some(post) => view! {
                                <Post
                                    title=post.title
                                    description=post.description
                                    date=post.date
                                    id=post.id.to_string()
                                    readtime=post.readtime
                                    tags=post.tags
                                >
                                    // Freedom
                                    <h1 id="freedom" class="text-2xl text-gray-800">
                                        <a href="#freedom">Freedom</a>
                                    </h1>
                                    <p class="text-gray-700">
                                    Fed up with the costs and limitations of renting a virtual server,
                                    I decided to set up my own dedicated server. To my pleasant surprise,
                                    it {wasnt} as complicated as I expected! {thats} how I got my first dedicated machine,
                                    which now hosts {Link::Aura.to_view()}, {Link::BERLi.to_view()}, and this website.
                                    </p>
                                    // Prerequisites
                                    <h1 id="prerequisites" class="text-2xl text-gray-800">
                                        <a href="#prerequisites">Prerequisites</a>
                                    </h1>
                                    <p class="text-gray-700 flex items-center gap-2">
                                        A pendrive and internet
                                        <Icon width="1em" height="1em" class="duration-200 group-hover:translate-x-[1.5px]" icon=i::BsEmojiSmileUpsideDown />
                                    </p>

                                    // Downloads
                                    <h1 id="downloads" class="text-2xl text-gray-800">
                                        <a href="#downloads">Downloads</a>
                                    </h1>
                                    <p>A list of files that you need download</p>
                                    <div class="overflow-x-auto rounded-lg border border-gray-200">
                                      <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                        <thead class="text-left">
                                          <tr>
                                            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">#</th>
                                            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Type</th>
                                            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Version</th>
                                            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Description</th>
                                            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Link</th>
                                          </tr>
                                        </thead>

                                        <tbody class="divide-y divide-gray-200">
                                            <tr>
                                                <td class="whitespace-nowrap px-4 py-2 text-gray-700">Bios</td>
                                                <td class="whitespace-nowrap px-4 py-2 text-gray-700">ZIP</td>
                                                <td class="whitespace-nowrap px-4 py-2 text-gray-700">Latest</td>
                                                <td class="whitespace-nowrap px-4 py-2 text-gray-700">Official BIOS</td>
                                                <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                                                    <a class="group flex items-center hover:text-[#68b5fc] duration-200" href="https://www.minisforum.com/new/support?lang=en#/support/page/download/108" rel="noopener" target="_blank">
                                                        Web
                                                        <Icon width="1em" height="1em" class="duration-200 group-hover:translate-x-[1.5px]" icon=i::ChArrowUpRight />
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="whitespace-nowrap px-4 py-2 text-gray-700">UEFI Shell</td>
                                                <td class="whitespace-nowrap px-4 py-2 text-gray-700">ISO</td>
                                                <td class="whitespace-nowrap px-4 py-2 text-gray-700">Latest</td>
                                                <td class="whitespace-nowrap px-4 py-2 text-gray-700">UEFI Shell</td>
                                                <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                                                    <a class="group flex items-center hover:text-[#68b5fc] duration-200" href="https://github.com/pbatard/UEFI-Shell/releases" rel="noopener" target="_blank">
                                                        GitHub
                                                        <Icon width="1em" height="1em" class="duration-200 group-hover:translate-x-[1.5px]" icon=i::ChArrowUpRight />
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="whitespace-nowrap px-4 py-2 text-gray-700">Rufus</td>
                                                <td class="whitespace-nowrap px-4 py-2 text-gray-700">EXE</td>
                                                <td class="whitespace-nowrap px-4 py-2 text-gray-700">Latest</td>
                                                <td class="whitespace-nowrap px-4 py-2 text-gray-700">Bootable USB tool</td>
                                                <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                                                    <a class="group flex items-center hover:text-[#68b5fc] duration-200" href="https://rufus.ie/en/" rel="noopener" target="_blank">
                                                        Web
                                                        <Icon width="1em" height="1em" class="duration-200 group-hover:translate-x-[1.5px]" icon=i::ChArrowUpRight />
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                      </table>
                                    </div>


                                    // Bootable
                                    <h1 id="boot" class="text-2xl text-gray-800">
                                        <a href="#boot">Booteable</a>
                                    </h1>
                                    <p>
                                        Now you need to use the UEFI Shell ISO and boot it to the pendrive.
                                        You need create the booteable pendrive in this scheme:
                                    </p>
                                    <div class="overflow-x-auto rounded-lg border border-gray-200">
                                      <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                        <thead class="text-left">
                                          <tr>
                                            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Device</th>
                                            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Boot selection</th>
                                            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Partition scheme</th>
                                            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Filesystem</th>
                                          </tr>
                                        </thead>

                                        <tbody class="divide-y divide-gray-200">
                                          <tr>
                                            <td class="whitespace-nowrap px-4 py-2 text-gray-700">Your pendrive</td>
                                            <td class="whitespace-nowrap px-4 py-2 text-gray-700">UEFI-Shell latest ISO</td>
                                            <td class="whitespace-nowrap px-4 py-2 text-gray-700">GPT</td>
                                            <td class="whitespace-nowrap px-4 py-2 text-gray-700">FAT32</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <p>
                                        Then extract the bios in the .zip and copy
                                        it to the pendrive that you boot with the UEFI Shell.
                                    </p>

                                    // Update
                                    <h1 id="update" class="text-2xl text-gray-800">
                                        <a href="#update">Update</a>
                                    </h1>

                                    <p>
                                        Insert the pendrive in the MS-01 and reboot, hit <code>DEL</code> to enter the BIOS menu, select UEFI Shell or boot from the pendrive..
                                        type and enter <code>FS0:</code> and select <code>AfuEfiFlash.nsh</code>
                                    </p>
                                    <p class="text-gray-700 flex items-center gap-2">
                                        The update will start automatically..
                                        <Icon width="1em" height="1em" class="duration-200 group-hover:translate-x-[1.5px]" icon=i::BiRocketSolid />
                                    </p>

                                    // Computers
                                    <h1 id="computers" class="text-2xl text-gray-800">
                                        <a href="#computers">Computers never sleep</a>
                                    </h1>
                                    <p>
                                        {thats} all, if you have any questions you can write to me.
                                    </p>
                                    <img
                                        class="w-full grayscale rounded-lg"
                                        src="/images/mf.webp"
                                        alt="Minisforum MS-01"
                                        href="/"
                                    />
                                </Post>
                            },
                            None => view! {
                                <p>"Project not found"</p>
                            }.into_view(),
                        })
                }}

            </Suspense>
            <InfoModal show={show_description} text={description}></InfoModal>
        </Layout>
    }
}
