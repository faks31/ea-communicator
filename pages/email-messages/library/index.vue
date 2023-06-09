<script lang="ts" setup>
import moment from 'moment';
import type { Media } from '~~/services/media.service';
import { useToasterStore } from '~~/store/toaster';
const { setLoader } = useLoader();
const { setMessage } = useToasterStore();
const user = useCurrentUser();
const ListHeaders = ['ID', 'Item Type', 'Created At', ''];

const mediaService = useService('media');
const extensions = {
  photos: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
  others: ['pdf', 'xls', 'xlsx', 'doc', 'docx', 'csv', 'ppt', 'pptx'],
};

const page = ref(1);
const pageSize = ref(10);
const orderType = ref<'desc' | 'asc'>('desc');
const orderBy = ref('id');
const search = ref('');
const extensionType = ref('');
const searchField = ref('');
const viewType = ref<'grid' | 'list'>('grid');
const { $trpc } = useNuxtApp();

setLoader(true);
const { data: medias, refresh } = await useAsyncData(() =>
  $trpc.library.list.query({
    search: search.value,
    pageNumber: page.value,
    orderType: orderType.value,
    orderBy: orderBy.value,
    pageSize: pageSize.value,
  }),
);
setLoader(false);
const searchKeyword = () => {
  search.value = searchField.value;
  page.value = 1;

  if (search.value) {
    refresh();
  }
};

const searchCategory = () => {
  search.value = `${extensionType.value}`;
  page.value = 1;
  refresh();
};

const paginate = (pg: number) => {
  page.value = pg;
  refresh();
};

const setPerPage = (perPage: number) => {
  pageSize.value = perPage;
  refresh();
};

const showModal = ref(false);
const viewImageModal = ref(false);
const deleteMediaId = ref();
const selectedMedia = ref();
const viewUploadModal = ref(false);

const handleAddMedia = async (data: { file: any[] }) => {
  const body = new FormData();
  data.file.forEach((fileItem: { file: string | Blob }) => {
    body.append('media[]', fileItem.file);
  });

  const res = await mediaService.create(body);

  if (res) {
    setMessage('File Uploaded Successfully', 'success');
    viewUploadModal.value = false;
    refresh();
  } else {
    setMessage('File not Uploaded.', 'error');
  }
};

async function deleteMedia(id: number) {
  try {
    await $trpc.library.delete.mutate(id);

    setMessage('Media deleted Successfully', 'success');
    showModal.value = false;
    refresh();
  } catch (error) {
    console.error(error);
  }
}

const viewMedia = (mediaObj: Media | number) => {
  let media = mediaObj as Media;
  if (typeof mediaObj === 'number') {
    media = medias.value!.data!.find((m) => m.id === mediaObj)!;
  }

  if (extensions.photos.includes(media.extension)) {
    viewImageModal.value = true;
    selectedMedia.value = media;
  } else {
    const element = document.createElement('a');
    element.href = media.fileUrl;
    element.download = '';

    element.click();
  }
};

const searchEmpty = () => {
  if (!searchField.value) {
    search.value = '';
    orderBy.value = 'id';
    refresh();
  }
};
</script>

<template>
  <div>
    <div mb-8>
      <div mb-10>
        <h4 class="mb-4 text-stone">Library</h4>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-silver">
              <NuxtLink to="/" class="text-silver sub-heading"
                >Communicator</NuxtLink
              >
              <span class="text-silver">/</span>
              <NuxtLink to="/email-messages" class="text-silver sub-heading">
                Communications</NuxtLink
              >
              <span class="text-silver">/</span>
              <span class="text-primary"> Library</span>
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-3 md:w-auto w-full">
            <FormKit
              v-model="viewType"
              type="select"
              validation="required"
              name="View"
              input-class="form-control"
              placeholder="View Type"
              :options="[
                { value: 'grid', label: 'Grid' },
                { value: 'list', label: 'List' },
              ]"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-wrap justify-between items-center gap-4">
        <div class="flex flex-wrap items-center gap-4">
          <FormKit
            v-model="searchField"
            prefix-icon="search"
            type="search"
            placeholder="Search"
            input-class="form-control pl-[3.5rem]"
            prefix-icon-class="search-icon"
            outer-class="md:w-[34rem] w-full search-field"
            @keyup.enter="searchKeyword"
            @input="searchEmpty"
          />
          <button class="btn btn-primary md:w-30 w-full" @click="searchKeyword">
            Search
          </button>
        </div>
        <div md:flex md:items-center gap-4>
          <button
            v-if="!user.hasRole('team-member')"
            class="mb-4 md:mb-0 border-none outline-none flex items-center py-[16px] px-[32px] rounded-[4px] text-stone text-[1.125rem] gap-3 cursor-pointer"
            @click="viewUploadModal = true"
          >
            <img src="/document-add.png" alt="" /> Add new item
          </button>
          <teleport to="body">
            <div v-if="viewUploadModal">
              <CModal
                :show-confirm-button="false"
                :show-close-button="false"
                @close="viewUploadModal = false"
              >
                <div class="md:w-[500px] w-full">
                  <h5 class="text-stone mb-5">Add New Item</h5>
                  <h6 class="text-stone mb-4">Upload Files</h6>
                  <FormKit
                    id="file"
                    :submit-attrs="{
                      inputClass: 'btn btn-primary',
                      wrapperClass: 'flex justify-end',
                    }"
                    type="form"
                    @submit="handleAddMedia"
                  >
                    <FormKit
                      type="file"
                      name="file"
                      :accept="`${extensions.photos.toString()},${extensions.others.toString()}`"
                      inner-class="file-uploader"
                      prefix-icon="link"
                      prefix-icon-class="mr-3"
                      outer-class="md:min-w-[20em] min-w-full mb-5"
                      multiple="true"
                    />
                  </FormKit>
                </div>
              </CModal>
            </div>
          </teleport>

          <FormKit
            v-model="extensionType"
            :options="[
              { label: 'All Categories', value: '' },
              ...extensions.photos,
              ...extensions.others,
            ]"
            type="select"
            placeholder="Search"
            input-class="form-control md:w-[14rem] w-full"
            @input="searchCategory"
          />
        </div>
      </div>
    </div>
    <div v-if="viewType === 'grid'" class="bg-white small-shadow p-6">
      <div
        v-if="medias?.total || 0 > 0"
        class="grid lg:grid-cols-7 md:grid-cols-3 grid-cols-1 gap-3 media-gallery"
      >
        <div
          v-for="media in medias?.data || []"
          :key="media.id"
          class="cursor-pointer relative overlay"
        >
          <img
            v-if="extensions.others.includes(media.extension)"
            class="w-[12rem] h-[12rem] w-full object-cover object-center"
            :src="`/icon/${media.extension}.png`"
            alt=""
          />
          <img
            v-if="extensions.photos.includes(media.extension)"
            class="w-[12rem] h-[12rem] w-full object-cover object-center"
            :src="media.fileUrl"
            alt=""
          />
          <div>{{ textLimit(media.title, 20) }}</div>
          <div v-if="extensions.photos.includes(media.extension)">
            <button class="view-btn" @click="viewMedia(media)">View</button>
          </div>
          <div v-else>
            <a class="view-btn" :href="media.fileUrl" target="_blank" download
              >Download</a
            >
          </div>
          <button
            v-if="user.hasRole('admin')"
            class="delete-btn cursor-pointer outline-none border-none bg-transparent p-0"
            @click="
              showModal = true;
              deleteMediaId = media.id;
            "
          >
            <img src="/trash-can.png" alt="" />
          </button>
          <teleport to="body">
            <div v-if="showModal">
              <CModal
                title="Confirmation"
                message="Are you sure you want to delete?"
                :item-id="deleteMediaId"
                @confirm="deleteMedia"
                @close="showModal = false"
              />
            </div>
          </teleport>
        </div>
      </div>
      <div v-else>
        <p>No items found in gallery</p>
      </div>
    </div>
    <div v-else class="bg-white small-shadow p-6">
      <DashboardTable
        :headers="ListHeaders"
        :rows="
          medias?.data?.map((media) => ({
            id: media.id,
            imageUrl: {
              image: extensions.others.includes(media.extension)
                ? `/icon/${media.extension}.png`
                : media.fileUrl,
            },
            createdAt: moment(media.createdAt).format(
              'dddd, Do MMMM YYYY h:mm A',
            ),
          })) || []
        "
        :is-dropdown="true"
        :drop-down-option="{
          isView: true,
          isEdit: false,
          isDelete: true,
        }"
        :actions="{
          view: (id: number) => viewMedia(id),
        }"
        @onDeleteRecord="(id: number) => deleteMedia(id)"
      />
    </div>

    <teleport to="body">
      <div v-if="viewImageModal">
        <CModal
          :show-confirm-button="false"
          :show-close-button="false"
          @close="viewImageModal = false"
        >
          <div>
            <img class="w-full h-full" :src="selectedMedia.fileUrl" alt="" />
            <h6 text-center text-stone>{{ selectedMedia.title }}</h6>
          </div>
        </CModal>
      </div>
    </teleport>
    <div class="ml-8">
      <PaginationTable
        :total-records="medias?.total || 0"
        :current-page="page"
        :page-size="pageSize"
        entity="Items"
        :paginate="paginate"
        @setPerPage="setPerPage"
      ></PaginationTable>
    </div>
    <div></div>
  </div>
</template>

<style lang="scss">
.media-gallery {
  .overlay {
    position: relative;
    display: inline-block;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        0deg,
        rgba(180, 36, 36, 0.2),
        rgba(180, 36, 36, 0.2)
      );
      opacity: 0;
      transition: opacity 0.3s ease;
      border: 1px solid #b42424;
    }

    &:hover:before {
      opacity: 1;
    }

    .view-btn {
      position: absolute;
      bottom: 1rem;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 8px 17px;
      background-color: #b42424;
      color: #ffffff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .delete-btn {
      position: absolute;
      top: 1.6rem;
      right: 0.3rem;
      transform: translate(-50%, -50%);
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover .view-btn {
      opacity: 1;
    }
    &:hover .delete-btn {
      opacity: 1;
    }
  }
}
</style>
