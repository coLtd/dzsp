import CLabel from '@/components/cmap/overlay/CLabel'

export default {
  name: 'cc-label',
  mixins: [CLabel],
  methods: {
    createLabel() {
      this.label = new window.CCLabel(this.latlng, this.$slots.default ? this.$el.innerHTML : this.text, {
        labelfontcolor: this.labelColor
      }, [this.offsetX || 0, this.offsetY || 0], null, this.className)
      this.addLayer(this.label)
      this.$nextTick(function () {
        this.updateColor()
        if (this.$listeners['label-click']) this.addListener(this.label, 'click', this.$listeners['label-click'])
        if (this.$listeners['label-mouseover']) this.addListener(this.label, 'mouseover', this.$listeners['label-mouseover'])
        if (this.$listeners['label-mouseleave']) this.addListener(this.label, 'mouseleave', this.$listeners['label-mouseleave'])
      })
    }
  }
}