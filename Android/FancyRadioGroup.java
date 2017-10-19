package comtelekpsi.github.oviedofireandroid;

import android.content.Context;
import android.util.AttributeSet;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.RelativeLayout;
import android.widget.TableRow;
import android.widget.TextView;

import static android.view.View.generateViewId;

/**
 * Created by David on 10/15/2017.
 */

public class FancyRadioGroup{
    public FancyRadioGroup(Context context, TableRow tableRow, TextView textView, RadioButton pButton, RadioButton mButton, RadioButton rButton){
        TableRow.LayoutParams rowParams= new TableRow.LayoutParams(TableRow.LayoutParams.MATCH_PARENT, TableRow.LayoutParams.MATCH_PARENT, 1.0f);
        textView.setLayoutParams(rowParams);

        RelativeLayout relativeLayout = new RelativeLayout(context);
        tableRow.addView(relativeLayout);
        relativeLayout.setLayoutParams(rowParams);

        relativeLayout.addView(pButton);
        relativeLayout.addView(mButton);

        RelativeLayout.LayoutParams topLParams= new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        topLParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
        pButton.setLayoutParams(topLParams);

        RelativeLayout.LayoutParams topRParams= new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        topRParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
        topRParams.addRule(RelativeLayout.RIGHT_OF,pButton.getId());
        mButton.setLayoutParams(topRParams);

        RelativeLayout.LayoutParams botParams= new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        botParams.addRule(RelativeLayout.BELOW,mButton.getId());
        relativeLayout.addView(rButton);
        rButton.setLayoutParams(botParams);
    }
}
