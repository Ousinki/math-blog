import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: 'Ousinki/math-blog',
  },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/post/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({
          label: 'Description',
          validation: { length: { min: 50, max: 160 } },
        }),
        publishDate: fields.date({
          label: 'Publish Date',
          defaultValue: { kind: 'today' },
        }),
        updatedDate: fields.date({
          label: 'Updated Date',
        }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: props => props.value,
          }
        ),
        draft: fields.checkbox({
          label: 'Draft',
          description: '勾选表示草稿，不会在生产环境显示',
          defaultValue: false,
        }),
        pinned: fields.checkbox({
          label: 'Pinned',
          description: '勾选表示置顶文章',
          defaultValue: false,
        }),
        ogImage: fields.text({
          label: 'OG Image',
          description: '社交媒体分享图片 URL（可选）',
        }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),
      },
    }),
    notes: collection({
      label: 'Notes',
      slugField: 'title',
      path: 'src/content/note/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({
          label: 'Description',
        }),
        publishDate: fields.datetime({
          label: 'Publish Date',
          defaultValue: { kind: 'now' },
        }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),
      },
    }),
  },
});
