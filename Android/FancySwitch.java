package comtelekpsi.github.oviedofireandroid;

import android.content.Context;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.os.Build;
import android.util.AttributeSet;
import android.widget.Switch;

/**
 * Created by David on 9/26/2017.
 */

public class FancySwitch extends Switch {
    public FancySwitch(Context context) {
        super(context);
    }

    public FancySwitch(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public FancySwitch(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @Override
    public void setChecked(boolean checked) {
        super.setChecked(checked);
        changeColor(checked);
    }

    private void changeColor(boolean isChecked) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
            int thumbColor;
            int trackColor;

            if (isChecked) {
                thumbColor = Color.argb(255, 40, 240, 40);
                trackColor = Color.argb(240, 10, 240, 40);
            } else {
                thumbColor = Color.argb(255, 236, 40, 40);
                trackColor = Color.argb(255, 236, 10, 40);
            }

            try {
                getThumbDrawable().setColorFilter(thumbColor, PorterDuff.Mode.MULTIPLY);
                getTrackDrawable().setColorFilter(trackColor, PorterDuff.Mode.MULTIPLY);
            } catch (NullPointerException e) {
                e.printStackTrace();
            }
        }
    }
}
